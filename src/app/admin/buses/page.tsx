'use client';

import { useState } from 'react';
import { Bus } from '@/types';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit2, Trash2, Bus as BusIcon, AlertCircle } from 'lucide-react';

export default function BusesPage() {
  const { buses, drivers, routes, addBus, updateBus, deleteBus } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Bus>>({});

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bus.busName && bus.busName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return 'Unassigned';
    return drivers.find(d => d.id === driverId)?.name || 'Unknown';
  };

  const getRouteName = (routeId: string | null) => {
    if (!routeId) return 'Unassigned';
    return routes.find(r => r.id === routeId)?.name || 'Unknown';
  };

  const handleOpenDialog = (bus?: Bus) => {
    if (bus) {
      setEditingBusId(bus.id);
      setFormData(bus);
    } else {
      setEditingBusId(null);
      setFormData({
        status: 'active',
        capacity: 40,
        fuelType: 'Diesel',
        averageMileage: 5
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.busNumber || !formData.registrationNumber) return;
    
    if (editingBusId) {
      updateBus(formData as Bus);
    } else {
      addBus({
        ...formData,
        id: `b${Date.now()}`
      } as Bus);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      deleteBus(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bus Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage transport fleet and driver assignments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all h-10 px-4" onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Bus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <DialogTitle className="flex items-center text-xl font-bold text-slate-800">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BusIcon className="w-5 h-5 text-blue-600" />
                </div>
                {editingBusId ? 'Edit Bus Details' : 'Add New Bus'}
              </DialogTitle>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bus Number <span className="text-red-500">*</span></Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.busNumber || ''} onChange={e => setFormData({...formData, busNumber: e.target.value})} placeholder="e.g. BUS-01" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Registration Number <span className="text-red-500">*</span></Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.registrationNumber || ''} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} placeholder="e.g. KA-01-AB-1234" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bus Name</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.busName || ''} onChange={e => setFormData({...formData, busName: e.target.value})} placeholder="e.g. Morning Express" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Capacity</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" type="number" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Driver Assignment</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.driverId || ''} 
                    onChange={e => setFormData({...formData, driverId: e.target.value || null})}
                  >
                    <option value="">Unassigned</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Route Assignment</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.routeId || ''} 
                    onChange={e => setFormData({...formData, routeId: e.target.value || null})}
                  >
                    <option value="">Unassigned</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Fuel Type</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.fuelType || 'Diesel'} 
                    onChange={e => setFormData({...formData, fuelType: e.target.value as Bus['fuelType']})}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg. Mileage (km/l)</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" type="number" step="0.1" value={formData.averageMileage || ''} onChange={e => setFormData({...formData, averageMileage: parseFloat(e.target.value) || 0})} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</Label>
                  <select 
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all"
                    value={formData.status || 'active'} 
                    onChange={e => setFormData({...formData, status: e.target.value as Bus['status']})}
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</Label>
                  <Input className="h-11 rounded-lg border-slate-200 focus-visible:ring-blue-500/20" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Maintenance info, etc." />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <Button variant="outline" className="rounded-lg h-10 px-5" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 px-5 shadow-sm" onClick={handleSave}>Save Bus</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search buses by number or name..." 
                className="pl-10 h-10 bg-slate-50/50 border-slate-200/60 rounded-xl text-sm focus-visible:ring-blue-500/20 focus-visible:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-11 px-6">Bus Details</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Capacity</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Assigned Driver</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Route</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Fuel & Mileage</TableHead>
                <TableHead className="font-semibold text-slate-600 h-11">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 h-11 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuses.map((bus) => (
                <TableRow key={bus.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <BusIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-tight">{bus.busNumber}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{bus.registrationNumber}</div>
                        {bus.busName && <div className="text-xs font-semibold text-blue-600/80 mt-0.5">{bus.busName}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm">{bus.capacity} seats</TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm">{getDriverName(bus.driverId)}</TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm max-w-[150px] truncate" title={getRouteName(bus.routeId)}>
                    {getRouteName(bus.routeId)}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm font-medium">
                    <div>{bus.fuelType || 'N/A'}</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">{bus.averageMileage || 0} km/l</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bus.status === 'active' ? 'default' : bus.status === 'maintenance' ? 'secondary' : 'destructive'} 
                      className={
                        bus.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                        bus.status === 'maintenance' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 shadow-none font-semibold px-2.5 py-0.5' : 
                        'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 shadow-none font-semibold px-2.5 py-0.5'
                      }>
                      {bus.status === 'maintenance' ? 'Under Maintenance' : bus.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(bus)} className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(bus.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No buses found</p>
                      <p className="text-sm">Try adjusting your search query.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
