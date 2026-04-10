import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps{
    message?: string;
}

export const FormSuccess = ({
    message,
}: FormSuccessProps)=>{
    if(!message) return null;

    return(
        <div className="flex items-start gap-x-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600">
            <CheckCircledIcon className="mt-0.5 h-4 w-4 shrink-0"/>
            <p className="leading-5">{message}</p>
        </div>
    )
}
