"use client"

import { useAuth, UserButton } from "@clerk/nextjs";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation"
import { Button } from "../ui/button";
import Container from "./Container";

const Navbar = () => {
    const router = useRouter();
    const { userId } = useAuth()

    return (<div className="sticky top-0 border border-b-primary/10">
        <Container>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() =>
                    router.push('/')
                }>
                    <Video />
                    <div className="font-extrabold text-xl">VIDOOR</div>
                </div>
                <div className="flex gap-3 items-center">
                    <UserButton />
                    {!userId && <>
                        <Button size='sm' variant='outline' onClick={()=> router.push('/sign-in')}>SignIn</Button>
                        <Button size='sm' onClick={()=> router.push('/sign-up')}>SignUp</Button>
                    </>}
                </div>
            </div>
        </Container>
    </div>);
}

export default Navbar;