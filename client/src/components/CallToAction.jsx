import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            {/* Lado izquierdo */}
            <div className="flex-1 justify-center flex flex-col">
                <h2 className="text-2xl">
                    Te gustaría sugerir una publicación?
                </h2>
                <p className="text-gray-500 my-2 text-justify">
                    Para sugerir una publicación, por favor asegúrate de que
                    cumpla con las siguientes restricciones: debe ser relevante
                    para nuestra audiencia, estar bien documentada y no
                    infringir derechos de autor. Nos reservamos el derecho de
                    revisar y editar las sugerencias antes de su publicación.
                </p>
                <Link to="/about" className="w-full">
                    <Button
                        gradientDuoTone="purpleToPink"
                        className="rounded-tl-xl rounded-bl-none w-full"
                    >
                        Saber más
                    </Button>
                </Link>
            </div>
            {/* Lado derecho */}
            <div className="p-7 flex-1">
                <img src="https://scoreapps.com/blog/wp-content/uploads/como-crear-un-blog.png" />
            </div>
        </div>
    );
}
