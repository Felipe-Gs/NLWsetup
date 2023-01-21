import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from "phosphor-react";
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function NewHaabitForm(){
    const [title, setTitle] =useState('')
    const [weekDays, setWeekdays] =useState<number[]>([])

    async function createNewHaabit(event: FormEvent){
        event.preventDefault();
        if(!title || weekDays.length === 0){
            return
        }
        await api.post('/habits', {
            title,
            weekDays,
        })
        setTitle('')
        setWeekdays([])
        alert('Hábito criado com sucesso!')

    }

    function handleToogleWeekDay(weekDay: number){
        if(weekDays.includes(weekDay)){
            const weekDayWithRemove = weekDays.filter(day => day === weekDay)

            setWeekdays(weekDayWithRemove)
        }else{
            const weekDayWithAdd = [...weekDays, weekDay]
            setWeekdays(weekDayWithAdd)
        }
    }

    return(
        <form className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input 
                type="text" 
                id="title" 
                placeholder="ex.: Exercicios, dormir bem, etc..." 
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                autoFocus
                value={title}
                onChange={event => setTitle(event.target.value)}
            />
            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrencia?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {availableWeekDays.map((weekDay, index )=>{
                    return(
                        <Checkbox.Root key={weekDay}
                            className='flex items-center gap-3 group'
                            checked={weekDays.includes(index)}
                            onCheckedChange={()=>{handleToogleWeekDay(index)}}
                        >
                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500'>
                            <Checkbox.Indicator className=''>
                            <Check size={20} className='text-white'/>
                            </Checkbox.Indicator>
                        </div>

                        <span className=' text-white leading-tight '>
                            {weekDay}
                        </span>
                        </Checkbox.Root>
                    )
                })}
            </div>

            <button onClick={createNewHaabit} type="submit" className="mt-6 rounded-lg p-4 justify-center flex items-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} width='bold'/>
                Confirmar
            </button>
        </form>
    )
}