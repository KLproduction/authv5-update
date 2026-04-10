import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps{
    message?: string;
}

export const FormError = ({
    message,
}: FormErrorProps)=>{
    if(!message) return null;

    return(
        <div className="flex items-start gap-x-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0"/>
            <p className="leading-5">{message}</p>
        </div>
    )
}
