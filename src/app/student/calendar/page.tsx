'use client';

import React from 'react';
import { useDataStore } from '@/lib/store';
import { CalendarScheduleEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Bus as BusIcon, Calendar, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function StudentCalendarPage() {
  const { user, students, calendarEvents, routes, buses } = useDataStore();

  const currentStudent = students.find(s => s.id === user?.id) || students[0];
  const assignedRoute = routes.find(r => r.id === currentStudent?.assignedRouteId);
  const assignedBus = buses.find(b => b.id === currentStudent?.assignedBusId);

  const todayStr = '2026-08-01';

  // Category Color Map
  const categoryStyles: Record<CalendarScheduleEvent['category'], { badge: string; dot: string; bg: string }> = {
    'Working Day': { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', bg: 'bg-emerald-50/50' },
    'Holiday': { badge: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', bg: 'bg-rose-50/50' },
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

  const holidays = calendarEvents.filter(e => e.category === 'Holiday');
  const examEvents = calendarEvents.filter(e => e.category === 'Exam');
  const collegeEvents = calendarEvents.filter(e => e.category === 'College Event' || e.category === 'Special Bus Duty');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6ECFA] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-sky-100 text-[#005BAC] rounded-xl">📅</span>
            Academic & Bus Calendar
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Monthly academic timings, holidays, exam bus schedules, and special event transport dates.</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-sky-50 border-sky-200 text-[#005BAC] font-bold px-4 py-1.5 text-sm shadow-sm">
            August 2026
          </Badge>
          {assignedRoute && (
            <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700 font-bold px-3 py-1.5 text-xs shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Route: {assignedRoute.name}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Legend Header */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-[#D6ECFA] shadow-sm text-xs font-bold">
        <span className="text-slate-500 uppercase text-[10px] tracking-wider font-extrabold">Schedule Legend:</span>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 🟢 Working Days</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> 🔴 Holidays</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> 🟡 Exams</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-500" /> 🔵 Special Bus Duty</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> 🟣 College Events</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MONTHLY CALENDAR GRID */}
        <Card className="lg:col-span-2 border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-sky-50/50 border-b border-[#D6ECFA] p-5 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">August 2026 Master Schedule</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">Real-time synchronization with BIT Depot dispatcher</CardDescription>
            </div>
            <span className="text-xs text-slate-600 font-mono bg-white px-3 py-1 rounded-full border border-slate-200 font-bold shadow-2xs">31 Days</span>
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
                    className={`min-h-[90px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all hover:shadow-xs ${
                      isToday 
                        ? 'ring-2 ring-[#005BAC] bg-sky-50/80 border-[#005BAC]' 
                        : style 
                          ? `${style.bg} border-slate-200/80` 
                          : 'bg-slate-50/50 border-slate-200/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                        isToday ? 'bg-[#005BAC] text-white' : 'text-slate-700'
                      }`}>
                        {dayNum}
                      </span>
                      {primaryEvent && (
                        <span className={`w-2 h-2 rounded-full ${style ? style.dot : 'bg-slate-400'}`} title={primaryEvent.category} />
                      )}
                    </div>

                    <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                      {events.map((ev) => (
                        <span key={ev.id} className="text-[10px] font-bold truncate text-slate-800 leading-tight bg-white/80 px-1 py-0.5 rounded-sm shadow-2xs border border-slate-200/40">
                          {ev.title}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SIDEBAR EVENTS LISTING */}
        <div className="space-y-6">
          {/* UPCOMING HOLIDAYS */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-rose-50/50 border-b border-rose-100 p-4">
              <CardTitle className="text-sm font-extrabold text-rose-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Upcoming Holidays ({holidays.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {holidays.length > 0 ? (
                holidays.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl bg-rose-50/30 border border-rose-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{h.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{h.description}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] font-bold bg-white text-rose-700 border-rose-200">
                      {h.date.split('-').slice(1).join('/')}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No scheduled holidays this month.</p>
              )}
            </CardContent>
          </Card>

          {/* EXAM TIMING & TRANSPORT */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-amber-50/50 border-b border-amber-100 p-4">
              <CardTitle className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Exam Bus Schedules ({examEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {examEvents.length > 0 ? (
                examEvents.map((ex) => (
                  <div key={ex.id} className="p-3 rounded-xl bg-amber-50/30 border border-amber-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{ex.title}</p>
                      <p className="text-[11px] text-amber-800 mt-0.5 font-semibold">Special afternoon return departures</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] font-bold bg-white text-amber-800 border-amber-300">
                      {ex.date.split('-').slice(1).join('/')}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No examinations scheduled.</p>
              )}
            </CardContent>
          </Card>

          {/* SPECIAL COLLEGE EVENTS & BUS DUTY */}
          <Card className="border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-sky-50/50 border-b border-sky-100 p-4">
              <CardTitle className="text-sm font-extrabold text-[#005BAC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#005BAC]" />
                Special Event Transport ({collegeEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {collegeEvents.length > 0 ? (
                collegeEvents.map((ce) => (
                  <div key={ce.id} className="p-3 rounded-xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{ce.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{ce.description}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] font-bold bg-white text-[#005BAC] border-sky-200">
                      {ce.date.split('-').slice(1).join('/')}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No special events scheduled.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
