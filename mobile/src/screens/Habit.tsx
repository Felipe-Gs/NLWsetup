import { Alert, ScrollView, View } from "react-native";
import { Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { ChechBox } from "../components/ChechBox";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";



interface Params{
    date: string;
}

interface DayInfoProps{
    completedHabits : string[];
    possibleHabits: {
        id: string;
        title: string;
    }[];
}



export function Habit(){
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])
    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length): 0
    
    const route = useRoute();
    const {date} = route.params as Params;

    const parsedDate = dayjs(date)
    const isDateInPast =parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth =parsedDate.format('DD/MM');

    async function fetchHabits() {
        try {
            setLoading(true)

            const response = await api.get('/day', {params: {date}});
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)

        } catch (error) {
            console.log(error);
            Alert.alert("Ops", "Não foi possivel carregar as informações")
        }finally{
            setLoading(false)
        }
    }

    async function handleToogleHabits(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);
            if(completedHabits.includes(habitId)){
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
            }else{
                setCompletedHabits(prevState => [...prevState, habitId]);
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Ops','Nao foi possivel atualizar o status do habito')
        }
        
    }

    useEffect(()=>{
        fetchHabits();
    },[])

    if(loading){
        return(
            <Loading/>
        )
    }


    return(
        <View className="flex-1 bg-background px-8 pt-16">
             <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{paddingBottom: 100}}
             >
                <BackButton/>
                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6", {
                    ["opacity-50"]: isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits ? 
                            dayInfo?.possibleHabits.map(habit =>(
                            <ChechBox 
                                key={habit.id}
                                title={habit.title} 
                                checked={completedHabits.includes(habit.id)}
                                disabled={isDateInPast}
                                onPress={()=> handleToogleHabits(habit.id)}
                            />
                        ))
                        : <HabitsEmpty/>
                    }
                </View>
                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            Voce nao pode editar um habito de uma data passada.
                        </Text>
                    )
                }
             </ScrollView>
            
        </View>
    )
}