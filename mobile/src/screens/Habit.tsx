import { ScrollView, View } from "react-native";
import { Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { ChechBox } from "../components/ChechBox";
import { useState } from "react";


interface Params{
    date: string;
}

export function Habit(){
    const route = useRoute();
    const {date} = route.params as Params;

    const parsedDate = dayjs(date)
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth =parsedDate.format('DD/MM');

    const [chech, setChech] = useState<boolean>(false)

    const handleclick =(index:number)=>{
        chech? setChech(false) : setChech(true)
    }

    const marcados =['1', '2', '3', '4', '5']


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
                <ProgressBar progress={80} />

                <View className="mt-6">
                    {
                        marcados.map((marc, index)=>(
                            <ChechBox 
                                key={index}
                                title="Beber 2l de agua" 
                                onPress={()=>handleclick(index)} 
                                checked={chech}
                                
                            />
                        ))
                    }
                    {/* 
                    <ChechBox title="Beber 2l de agua"
                        
                    /> */}
                </View>
             </ScrollView>
            
        </View>
    )
}