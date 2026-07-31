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
import { Plus, Search, Edit2, Trash2, Bus as BusIcon } from 'lucide-react';

export default function BusesPage() {
  const { buses, drivers, routes, addBus, updateBus, deleteBus } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  
  // Form state
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Bus Management</h1>
          <p className="text-slate-500 mt-1">Manage transport fleet and driver assignments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 shadow-md text-white" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Bus
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <BusIcon className="w-5 h-5 mr-2 text-blue-600" />
                {editingBusId ? 'Edit Bus Details' : 'Add New Bus'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Bus Number *</Label>
                <Input value={formData.busNumber || ''} onChange={e => setFormData({...formData, busNumber: e.target.value})} placeholder="e.g. BUS-01" />
              </div>
              <div className="space-y-2">
                <Label>Registration Number *</Label>
                <Input value={formData.registrationNumber || ''} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} placeholder="e.g. KA-01-AB-1234" />
              </div>
              <div className="space-y-2">
                <Label>Bus Name</Label>
                <Input value={formData.busName || ''} onChange={e => setFormData({...formData, busName: e.target.value})} placeholder="e.g. Morning Express" />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
              </div>
              
              <div className="space-y-2">
                <Label>Driver Assignment</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={formData.driverId || ''} 
                  onChange={e => setFormData({...formData, driverId: e.target.value || null})}
                >
                  <option value="">Unassigned</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Route Assignment</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={formData.routeId || ''} 
                  onChange={e => setFormData({...formData, routeId: e.target.value || null})}
                >
                  <option value="">Unassigned</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
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
                <Label>Avg. Mileage (km/l)</Label>
                <Input type="number" step="0.1" value={formData.averageMileage || ''} onChange={e => setFormData({...formData, averageMileage: parseFloat(e.target.value) || 0})} />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={formData.status || 'active'} 
                  onChange={e => setFormData({...formData, status: e.target.value as Bus['status']})}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label>Notes</Label>
                <Input value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Maintenance info, etc." />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save Bus</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search buses..." 
                className="pl-9 bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Bus</TableHead>
                  <TableHead className="font-semibold text-slate-600">Capacity</TableHead>
                  <TableHead className="font-semibold text-slate-600">Assigned Driver</TableHead>
                  <TableHead className="font-semibold text-slate-600">Route</TableHead>
                  <TableHead className="font-semibold text-slate-600">Fuel & Mileage</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuses.map((bus) => (
                  <TableRow key={bus.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-slate-800">{bus.busNumber}</div>
                      <div className="text-xs text-slate-500">{bus.registrationNumber}</div>
                      {bus.busName && <div className="text-xs font-semibold text-blue-600 mt-0.5">{bus.busName}</div>}
                    </TableCell>
                    <TableCell className="text-slate-600">{bus.capacity} seats</TableCell>
                    <TableCell className="text-slate-600">{getDriverName(bus.driverId)}</TableCell>
                    <TableCell className="text-slate-600 max-w-[150px] truncate" title={getRouteName(bus.routeId)}>{getRouteName(bus.routeId)}</TableCell>
                    <TableCell className="text-slate-600">
                      <div>{bus.fuelType || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{bus.averageMileage || 0} km/l</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={bus.status === 'active' ? 'default' : bus.status === 'maintenance' ? 'secondary' : 'destructive'} 
                        className={
                          bus.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none' : 
                          bus.status === 'maintenance' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-none' : ''
                        }>
                        {bus.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(bus)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(bus.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBuses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No buses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
