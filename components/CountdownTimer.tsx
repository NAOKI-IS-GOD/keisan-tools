'use client';

import {useEffect,useState} from 'react';

const TARGET_MONTH=0;
const TARGET_DAY=1;
const TARGET_HOUR=0;

function getNextTarget(now:Date){
  let target=new Date(now.getFullYear(),TARGET_MONTH,TARGET_DAY,TARGET_HOUR,0,0,0);
  if(target.getTime()<=now.getTime()){
    target=new Date(now.getFullYear()+1,TARGET_MONTH,TARGET_DAY,TARGET_HOUR,0,0,0);
  }
  return target;
}

function formatRemaining(ms:number){
  const totalSeconds=Math.max(0,Math.floor(ms/1000));
  const days=Math.floor(totalSeconds/86400);
  const hours=Math.floor((totalSeconds%86400)/3600);
  const minutes=Math.floor((totalSeconds%3600)/60);
  const seconds=totalSeconds%60;
  return {days,hours,minutes,seconds};
}

export default function CountdownTimer(){
  const [now,setNow]=useState<Date|null>(null);

  useEffect(()=>{
    setNow(new Date());
    const timer=window.setInterval(()=>setNow(new Date()),1000);
    return ()=>window.clearInterval(timer);
  },[]);

  if(!now)return null;

  const target=getNextTarget(now);
  const remaining=formatRemaining(target.getTime()-now.getTime());

  return <aside className="countdown-timer" aria-label="1月1日0時までのタイマー" aria-live="polite">
    <span className="countdown-label">1/1 00:00まで</span>
    <strong>{remaining.days}日 {String(remaining.hours).padStart(2,'0')}:{String(remaining.minutes).padStart(2,'0')}:{String(remaining.seconds).padStart(2,'0')}</strong>
  </aside>;
}
