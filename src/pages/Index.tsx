import { useState } from "react";
import PasswordForm from "@/components/PasswordForm.tsx";
import PasswordConfigForm from "@/components/PasswordConfigForm";
import { defaultPasswordConfig, type PasswordConfig } from "@/lib/passwordSchema";

const Index = () => {
    const [config, setConfig] = useState<PasswordConfig>(defaultPasswordConfig);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="grid w-full max-w-[1040px] gap-6 md:grid-cols-2">
                <PasswordConfigForm config={config} onChange={setConfig} />
                <PasswordForm key={JSON.stringify(config)} config={config} />
            </div>
        </div>
    );
};

export default Index;
