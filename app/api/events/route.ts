import {NextRequest, NextResponse} from "next/server";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";


export async function POST(req: NextRequest) {
    try{
        await connectDB()
        const formData = await req.formData();

        let event;
        try{
            event = Object.fromEntries(formData.entries());


        }catch (e) {
            return NextResponse.json({message:'Invalid JSON Format',status:400, error:e instanceof Error ? e.message : 'Unknown error'})
        }

        const createdEvent = await Event.create(event)
        console.log(createdEvent)
        return NextResponse.json({message:'Event created',status:201,event:createdEvent})
    }catch (e){
        console.error(e)
        return NextResponse.json({message:'Event creation failed',error:e instanceof Error ? e.message : 'Unknown error',status:500})
    }
}

