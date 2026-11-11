import Image from "next/image";
import { Button } from "./components/ui/Button";
import { TextField } from "./components/ui/Field";
import { Choice } from "./components/ui/Choice";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     {/* <Button variant="primary" className="mb-4" />
        <Button variant="secondary" className="mb-4"> Secondary Button
  </Button>
         

        <TextField id="email" label="Email" placeholder="Enter your email" />

        <Choice type="radio" label="Option 1" name="options" /> */}
    </div>
  );
}
