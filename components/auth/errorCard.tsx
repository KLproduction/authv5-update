import { CardWapper } from "./CardWrapper"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export const ErrorCard = () =>{
    return(
        <CardWapper 
          headerLabel="Something went wrong"
          backBtnHref="/auth/login"
          backBtnLabel="Back to login">
            <div className="flex min-h-[120px] w-full items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <ExclamationTriangleIcon className="h-6 w-6"/>
                </div>
            </div>
        </CardWapper>
    )
}
