'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/store';
import { CalendarScheduleEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, MapPin, Bus as BusIcon, Calendar, Sparkles, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudentCalendarPage() {
  const { user, students, calendarEvents, routes, buses } = useDataStore();

  const currentStudent = students.find(s => s.id === user?.id) || students[0];
  const assignedRoute = routes.find(r => r.id === currentStudent?.assignedRouteId);

  // Initialize with real current date using JavaScript Date API
  const initialDate = new Date();
  const [currentYear, setCurrentYear] = useState(() => initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => initialDate.getMonth()); // 0-indexed (7 = August)

  // Navigation handlers with clean leap year & year transition support
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Dynamic calculations using JavaScript Date API
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun ... 6 = Sat
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Total days in current month

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[currentMonth];
  const displayMonthYear = `${currentMonthName} ${currentYear}`;

  // Check if a day is today
  const isTodayDate = (dayNum: number) => {
    const d = new Date();
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === dayNum;
  };

  // Category Color Map supporting existing and custom badge categories
  const categoryStyles: Record<string, { badge: string; dot: string; bg: string }> = {
    'Working Day': { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', bg: 'bg-emerald-50/50' },
    'Holiday': { badge: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', bg: 'bg-rose-50/50' },
    'Exam': { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', bg: 'bg-amber-50/50' },
    'Special Bus Duty': { badge: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', bg: 'bg-sky-50/50' },
    'College Event': { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', bg: 'bg-purple-50/50' },
    'Maintenance Day': { badge: 'bg-slate-200 text-slate-800 border-slate-300', dot: 'bg-slate-700', bg: 'bg-slate-100/60' },
    'Regular Class': { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', bg: 'bg-emerald-50/50' },
    'Semester Exam': { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', bg: 'bg-amber-50/50' },
    'BIT Conference': { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', bg: 'bg-purple-50/50' },
    'Independence Day': { badge: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', bg: 'bg-rose-50/50' },
  };

  const defaultStyle = { badge: 'bg-sky-100 text-[#005BAC] border-sky-200', dot: 'bg-[#005BAC]', bg: 'bg-sky-50/40' };

  // Empty placeholder cells for days before the 1st of the month
  const emptyPrefixCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Dynamic month days array
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    const events = calendarEvents.filter(e => e.date === dateStr);
    return { dayNum, dateStr, events };
  });

  const holidays = calendarEvents.filter(e => e.category === 'Holiday' || String(e.category) === 'Independence Day');
  const examEvents = calendarEvents.filter(e => e.category === 'Exam' || String(e.category) === 'Semester Exam');
  const collegeEvents = calendarEvents.filter(e => e.category === 'College Event' || e.category === 'Special Bus Duty' || String(e.category) === 'BIT Conference');

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

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D6ECFA] shadow-xs">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0 text-slate-700 hover:bg-sky-50" title="Previous Month">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToday} className="h-8 px-3 text-xs font-bold text-[#005BAC] hover:bg-sky-50">
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0 text-slate-700 hover:bg-sky-50" title="Next Month">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Badge variant="outline" className="bg-sky-50 border-sky-200 text-[#005BAC] font-extrabold px-4 py-1.5 text-sm shadow-sm">
            {displayMonthYear}
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
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 🟢 Working Days / Regular Classes</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> 🔴 Holidays</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> 🟡 Exams</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-500" /> 🔵 Special Bus Duty</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> 🟣 College Events / Conference</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MONTHLY CALENDAR GRID */}
        <Card className="lg:col-span-2 border border-[#D6ECFA] shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-sky-50/50 border-b border-[#D6ECFA] p-5 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">{displayMonthYear} Master Schedule</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">Real-time synchronization with BIT Depot dispatcher</CardDescription>
            </div>
            <span className="text-xs text-slate-600 font-mono bg-white px-3 py-1 rounded-full border border-slate-200 font-bold shadow-2xs">{daysInMonth} Days</span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase py-2 border-b border-slate-100">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-3">
              {emptyPrefixCells.map((val) => (
                <div key={`empty-${val}`} className="min-h-[90px] p-2 rounded-xl border border-transparent bg-slate-50/20 opacity-40 pointer-events-none" />
              ))}
              {daysArray.map(({ dayNum, dateStr, events }) => {
                const isToday = isTodayDate(dayNum);
                const primaryEvent = events[0];
                const style = primaryEvent ? (categoryStyles[primaryEvent.category] || defaultStyle) : null;

                return (
                  <div 
                    key={dateStr}
                    className={`min-h-[90px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all hover:shadow-xs ${
                      isToday 
                        ? 'ring-2 ring-[#005BAC] bg-sky-100/80 border-[#005BAC] shadow-sm' 
                        : style 
                          ? `${style.bg} border-slate-200/80` 
                          : 'bg-slate-50/50 border-slate-200/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                        isToday ? 'bg-[#005BAC] text-white shadow-xs' : 'text-slate-700'
                      }`}>
                        {dayNum}
                      </span>
                      {primaryEvent && (
                        <span className={`w-2 h-2 rounded-full ${style ? style.dot : 'bg-slate-400'}`} title={primaryEvent.category} />
                      )}
                    </div>

                    <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                      {events.map((ev) => (
                        <span key={ev.id} className="text-[10px] font-bold truncate text-slate-800 leading-tight bg-white/90 px-1.5 py-0.5 rounded-sm shadow-2xs border border-slate-200/50">
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
