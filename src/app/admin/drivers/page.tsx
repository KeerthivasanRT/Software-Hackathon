'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Search, Plus, Edit2, Trash2, UserCircle, Briefcase, MapPin, Bus, AlertTriangle, Phone, Mail, FileText, Calendar } from 'lucide-react';
import { useDataStore } from '@/lib/store';
import { Driver } from '@/types';

export default function AdminDriversPage() {
  const { drivers, buses, routes, addDriver, updateDriver, deleteDriver } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | ''>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver> | null>(null);
  const [validationError, setValidationError] = useState('');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          driver.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? driver.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (driver?: Driver) => {
    if (driver) {
      setCurrentDriver({ ...driver });
    } else {
      setCurrentDriver({
        name: '',
        email: '',
        role: 'driver',
        employeeId: '',
        licenseNumber: '',
        licenseExpiry: '',
        experience: 0,
        phone: '',
        status: 'active',
        assignedBusId: null,
        assignedRouteId: null,
      });
    }
    setValidationError('');
    setIsDialogOpen(true);
  };

  const handleSaveDriver = () => {
    if (!currentDriver?.name || !currentDriver?.employeeId) {
      setValidationError('Name and Employee ID are required.');
      return;
    }
    
    // Check for bus conflict: "One bus cannot have multiple active drivers."
    if (currentDriver.assignedBusId && currentDriver.status === 'active') {
      const conflictDriver = drivers.find(d => 
        d.assignedBusId === currentDriver.assignedBusId && 
        d.status === 'active' && 
        d.id !== currentDriver.id
      );
      if (conflictDriver) {
        const busNum = buses.find(b => b.id === currentDriver.assignedBusId)?.busNumber;
        setValidationError(`Conflict: ${busNum} is already assigned to active driver ${conflictDriver.name}.`);
        return;
      }
    }

    if (currentDriver.id) {
      updateDriver(currentDriver as Driver);
    } else {
      addDriver({ ...currentDriver, id: `d${Date.now()}` } as Driver);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentDriver?.id) {
      deleteDriver(currentDriver.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            <UserCircle className="w-8 h-8 mr-3 text-sky-600" />
            Driver Management
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Manage driver profiles, route assignments, and fleet allocation.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl h-11 px-5 shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-5 h-5 mr-2" /> Add New Driver
        </Button>
      </div>

      <Card className="border border-[#D6ECFA] border-t-4 border-t-emerald-500 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6 border-b border-[#D6ECFA]">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-600 w-4 h-4" />
              <Input 
                placeholder="Search by name or Employee ID..." 
                className="pl-10 h-11 bg-sky-50/50 border-[#D6ECFA] rounded-xl text-sm focus-visible:ring-sky-500/20 focus-visible:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="h-11 rounded-xl border border-[#D6ECFA] bg-sky-50/50 px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-sky-50/80">
              <TableRow className="border-b border-[#D6ECFA] hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-12 px-6">Driver Info</TableHead>
                <TableHead className="font-semibold text-slate-600 h-12">Contact Details</TableHead>
                <TableHead className="font-semibold text-slate-600 h-12">Assigned Bus & Destination</TableHead>
                <TableHead className="font-semibold text-slate-600 h-12">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 h-12 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => {
                const assignedBus = buses.find(b => b.id === driver.assignedBusId);
                const assignedRoute = routes.find(r => r.id === driver.assignedRouteId);
                
                return (
                  <TableRow key={driver.id} className="hover:bg-sky-50/80 transition-colors border-b border-[#D6ECFA] group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-sky-600 font-bold flex items-center justify-center shadow-sm">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight">{driver.name}</p>
                          <p className="text-xs font-medium text-slate-600 flex items-center mt-0.5">
                            <Briefcase className="w-3 h-3 mr-1" /> {driver.employeeId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-700 flex items-center">
                          <Phone className="w-3 h-3 mr-1.5 text-slate-600" /> {driver.phone}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center">
                          <Mail className="w-3 h-3 mr-1.5 text-slate-600" /> {driver.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignedBus || assignedRoute ? (
                        <div className="space-y-1">
                          {assignedBus && (
                            <Badge variant="outline" className="bg-sky-50 text-sky-600 border-sky-200 font-semibold text-xs py-0">
                              <Bus className="w-3 h-3 mr-1" /> {assignedBus.busNumber}
                            </Badge>
                          )}
                          {assignedRoute && (
                            <div className="space-y-0.5 mt-1">
                              <p className="text-xs font-medium text-slate-600 flex items-center">
                                <MapPin className="w-3 h-3 mr-1 text-slate-600" /> {assignedRoute.name}
                              </p>
                              {assignedRoute.stops.length > 0 && (
                                <p className="text-[10px] text-slate-500 flex items-center ml-4">
                                  To: {assignedRoute.stops[assignedRoute.stops.length - 1].name}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-600 italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={driver.status === 'active' ? 'default' : 'secondary'} 
                        className={driver.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60' : 'bg-white text-slate-600 border border-[#D6ECFA]'}>
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(driver)} className="h-8 w-8 text-slate-600 hover:text-sky-600 hover:bg-sky-50">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setCurrentDriver(driver); setIsDeleteDialogOpen(true); }} className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredDrivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-600 font-medium">
                    No drivers found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Driver Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl overflow-hidden p-0 border-[#D6ECFA] shadow-xl">
          <div className="bg-sky-600 h-2" />
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center">
                <UserCircle className="w-5 h-5 mr-2 text-sky-600" />
                {currentDriver?.id ? 'Edit Driver Profile' : 'Register New Driver'}
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium">
                Complete the driver registration and routing assignments below.
              </DialogDescription>
            </DialogHeader>
            
            {validationError && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Personal Information</h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <Input 
                    placeholder="e.g. S. Kumar" 
                    value={currentDriver?.name || ''} 
                    onChange={e => setCurrentDriver({...currentDriver, name: e.target.value})} 
                    className="h-10 bg-sky-50 border-[#D6ECFA]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Employee ID</label>
                  <Input 
                    placeholder="e.g. DRV-001" 
                    value={currentDriver?.employeeId || ''} 
                    onChange={e => setCurrentDriver({...currentDriver, employeeId: e.target.value})} 
                    className="h-10 bg-sky-50 border-[#D6ECFA]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Phone</label>
                    <Input 
                      placeholder="Mobile Number" 
                      value={currentDriver?.phone || ''} 
                      onChange={e => setCurrentDriver({...currentDriver, phone: e.target.value})} 
                      className="h-10 bg-sky-50 border-[#D6ECFA]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <Input 
                      placeholder="Email Address" 
                      value={currentDriver?.email || ''} 
                      onChange={e => setCurrentDriver({...currentDriver, email: e.target.value})} 
                      className="h-10 bg-sky-50 border-[#D6ECFA]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Professional Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">License Number</label>
                    <Input 
                      placeholder="TN-DL-..." 
                      value={currentDriver?.licenseNumber || ''} 
                      onChange={e => setCurrentDriver({...currentDriver, licenseNumber: e.target.value})} 
                      className="h-10 bg-sky-50 border-[#D6ECFA]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">License Expiry</label>
                    <Input 
                      type="date"
                      value={currentDriver?.licenseExpiry || ''} 
                      onChange={e => setCurrentDriver({...currentDriver, licenseExpiry: e.target.value})} 
                      className="h-10 bg-sky-50 border-[#D6ECFA]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Experience (Years)</label>
                    <Input 
                      type="number"
                      min="0"
                      value={currentDriver?.experience || 0} 
                      onChange={e => setCurrentDriver({...currentDriver, experience: parseInt(e.target.value) || 0})} 
                      className="h-10 bg-sky-50 border-[#D6ECFA]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Status</label>
                    <select 
                      value={currentDriver?.status || 'active'} 
                      onChange={e => setCurrentDriver({...currentDriver, status: e.target.value as any})} 
                      className="w-full h-10 rounded-md border border-[#D6ECFA] bg-sky-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-4 bg-sky-50 border border-[#D6ECFA] rounded-xl mt-4">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Vehicle & Route Assignment</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center">
                        <Bus className="w-3 h-3 mr-1" /> Assign Bus
                      </label>
                      <select 
                        value={currentDriver?.assignedBusId || ''} 
                        onChange={e => setCurrentDriver({...currentDriver, assignedBusId: e.target.value || null})} 
                        className="w-full h-10 rounded-md border border-[#D6ECFA] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="">No Bus Assigned</option>
                        {buses.map(bus => (
                          <option key={bus.id} value={bus.id}>{bus.busNumber} ({bus.registrationNumber})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> Assign Route (Destination)
                      </label>
                      <select 
                        value={currentDriver?.assignedRouteId || ''} 
                        onChange={e => setCurrentDriver({...currentDriver, assignedRouteId: e.target.value || null})} 
                        className="w-full h-10 rounded-md border border-[#D6ECFA] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="">No Route Assigned</option>
                        {routes.map(route => {
                          const destination = route.stops[route.stops.length - 1]?.name || 'Unknown';
                          return (
                            <option key={route.id} value={route.id}>{route.name} (To: {destination})</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-8 pt-6 border-t border-[#D6ECFA]">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="font-semibold">Cancel</Button>
              <Button onClick={handleSaveDriver} className="bg-sky-600 hover:bg-sky-700 font-bold px-6 shadow-md shadow-blue-500/20">
                Save Driver Details
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-red-100 shadow-xl shadow-red-500/10 p-0 overflow-hidden">
          <div className="bg-red-600 h-2" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600 font-bold text-xl">
                <AlertTriangle className="w-6 h-6 mr-2" /> Delete Driver
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium text-base pt-2">
                Are you sure you want to remove <span className="font-bold text-slate-900">{currentDriver?.name}</span>? This will unassign them from any active buses or routes.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="font-semibold">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} className="font-bold bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20">
                Confirm Deletion
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
