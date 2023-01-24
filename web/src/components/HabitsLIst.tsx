import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from "phosphor-react";
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitListProps{
  date: Date;
  onCompletedChanged:(completed:number)=> void;
}


interface HabitsInfo{
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>,
  completedHabits: string[];
}
export function HabitsList({date, onCompletedChanged}: HabitListProps){

  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(()=>{
    api.get('/day', {
      params:{
        date: date.toISOString(),
      }
    }).then(response => {
      setHabitsInfo(response.data)
      
    })
  },[])

  async function handleToggleHabits(habitId: string){
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

    await api.patch(`/habits/${habitId}/toggle`)
 
    let completedHabits: string[] =[]
    if(isHabitAlreadyCompleted){
      //remover da lista
      completedHabits = habitsInfo!.completedHabits.filter(id => id != habitId)
     
    }else{
      //adicionar na lista
      completedHabits =[...habitsInfo!.completedHabits, habitId]
    }
    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    })
    onCompletedChanged(completedHabits.length)
  }

  const isDateInPast =dayjs(date).endOf('day').isBefore(new Date())
    return(
          <div className='mt-6 flex flex-col gap-3'>
            {habitsInfo?.possibleHabits.map(habit =>{
              return(
                <Checkbox.Root 
                  key={habit.id}
                  onCheckedChange={()=>handleToggleHabits(habit.id)}
                  checked={habitsInfo.completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                >
                  <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500 transition-colors  focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background'>
                    <Checkbox.Indicator className=''>
                      <Check size={20} className='text-white'/>
                    </Checkbox.Indicator>
                  </div>

                  <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                   {habit.title}
                  </span>
                </Checkbox.Root>
              )
            })}
            

          </div>
    )
}