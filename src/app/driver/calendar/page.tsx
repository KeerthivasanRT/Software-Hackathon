'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { CalendarScheduleEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Bus as BusIcon, Calendar, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DriverCalendarPage() {
  const { user, drivers, calendarEvents } = useDataStore();

  const currentDriverId = user?.role === 'driver' ? user.id : 'd1';
  const currentDriver = drivers.find(d => d.id === currentDriverId) || drivers[0];

  const todayStr = '2026-08-01';

  // Category Color Map
  const categoryStyles: Record<CalendarScheduleEvent['category'], { badge: string; dot: string; bg: string }> = {
    'Working Day': { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', bg: 'bg-emerald-50/50' },
    'Holiday': { badge: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500', bg: 'bg-red-50/50' },
    'Exam': { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', bg: 'bg-amber-50/50' },
    'Special Bus Duty': { badge: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', bg: 'bg-sky-50/50' },
    'College Event': { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', bg: 'bg-purple-50/50' },
    'Maintenance Day': { badge: 'bg-slate-200 text-slate-800 border-slate-300', dot: 'bg-slate-700', bg: 'bg-slate-100/60' },
  };

  // 31 Days for August 2026
  const daysInAugust = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const events = calendarEvents.filter(e => e.date === dateStr);
    return { dayNum, dateStr, events };
  });

  const todayEvents = calendarEvents.filter(e => e.date === todayStr);
  const tomorrowEvents = calendarEvents.filter(e => e.date === '2026-08-02');
  const holidays = calendarEvents.filter(e => e.category === 'Holiday');
  const specialDuties = calendarEvents.filter(e => e.category === 'Special Bus Duty');
  const maintenanceEvents = calendarEvents.filter(e => e.category === 'Maintenance Day');
  const examEvents = calendarEvents.filter(e => e.category === 'Exam');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">📅</span>
            Calendar & Transport Schedule
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Monthly schedule, special duties, holiday listings, and maintenance dates.</p>
        </div>

        <Badge variant="outline" className="bg-sky-50 border-sky-200 text-sky-700 font-bold px-4 py-1.5 text-sm">
          August 2026
        </Badge>
      </div>

      {/* Legend Header */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-[#D6ECFA] shadow-sm text-xs font-bold">
        <span className="text-slate-500 uppercase text-[10px]">Schedule Legend:</span>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 🟢 Working Days</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> 🔴 Holidays</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> 🟡 Exams</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-500" /> 🔵 Special Bus Duty</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> 🟣 College Events</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-700" /> ⚫ Maintenance Days</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MONTHLY CALENDAR GRID */}
        <Card className="lg:col-span-2 border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-5 flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-bold text-slate-800">August 2026 Master Schedule</CardTitle>
            <span className="text-xs text-slate-500 font-mono">31 Days</span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase py-2 border-b border-slate-100">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-3">
              {daysInAugust.map(({ dayNum, dateStr, events }) => {
                const isToday = dateStr === todayStr;
                const primaryEvent = events[0];
                const style = primaryEvent ? categoryStyles[primaryEvent.category] : null;

                return (
                  <div 
                    key={dateStr}
                    className={`min-h-[85px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all ${
                      isToday 
                        ? 'ring-2 ring-sky-600 bg-sky-50/60 border-sky-300' 
                        : style 
                          ? `${style.bg} border-slate-200` 
                          : 'bg-slate-50/40 border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold font-mono ${isToday ? 'text-sky-700 bg-sky-200 px-1.5 py-0.5 rounded' : 'text-slate-700'}`}>
                        {dayNum}
                      </span>
                      {style && <span className={`w-2 h-2 rounded-full ${style.dot}`} />}
                    </div>

                    {events.length > 0 ? (
                      <div className="space-y-1">
                        {events.map(ev => (
                          <div key={ev.id} className="text-[10px] font-bold truncate leading-tight text-slate-800 bg-white/80 p-1 rounded border border-slate-200/60" title={ev.title}>
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Regular Duty</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SIDE PANELS FOR TODAY & UPCOMING SCHEDULE */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
            <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" /> Today's Schedule (01 Aug)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {todayEvents.map(ev => (
                <div key={ev.id} className="p-3 bg-sky-50/60 border border-sky-200 rounded-xl space-y-1">
                  <Badge className={categoryStyles[ev.category].badge}>{ev.category}</Badge>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{ev.title}</h4>
                  <p className="text-xs text-slate-600">{ev.description}</p>
                </div>
              ))}
              {todayEvents.length === 0 && (
                <p className="text-xs text-slate-500">Regular Academic Route Duty (07:30 AM & 04:30 PM).</p>
              )}
            </CardContent>
          </Card>

          {/* Assigned Special Duties */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
            <CardHeader className="bg-sky-50/40 border-b border-[#D6ECFA] p-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" /> Assigned Special Duties
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {specialDuties.map(ev => (
                <div key={ev.id} className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sky-900 text-xs">{ev.title}</span>
                    <span className="text-[10px] font-mono text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">{ev.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{ev.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Holidays */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
            <CardHeader className="bg-red-50/50 border-b border-red-100 p-4">
              <CardTitle className="text-base font-bold text-red-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" /> Upcoming Holidays
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {holidays.map(ev => (
                <div key={ev.id} className="p-2.5 bg-red-50/60 border border-red-200 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-red-900">{ev.title}</span>
                  <span className="font-mono font-bold text-red-700">{ev.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Maintenance & Exam Schedules */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl">
            <CardHeader className="bg-slate-50 border-b border-slate-200 p-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BusIcon className="w-4 h-4 text-slate-600" /> Workshop & Exam Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[...examEvents, ...maintenanceEvents].map(ev => (
                <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <Badge className={categoryStyles[ev.category].badge}>{ev.category}</Badge>
                  <h4 className="font-bold text-slate-900 text-xs mt-1">{ev.title} ({ev.date})</h4>
                  <p className="text-[11px] text-slate-600">{ev.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
