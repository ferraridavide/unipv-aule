import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MailQuestionIcon, SendIcon } from "lucide-react";

function Contacts() {
    
    const mailMessage = `Con la presente desideriamo richiedere accesso al calendario relativo all'aula [inserire qui], al fine di integrare le informazioni sul sito https://ferraridavide.github.io/unipv-aule/.%0D%0AQuesta integrazione consentirebbe una più efficace individuazione delle aule disponibili per lo studio.%0D%0ARimaniamo a disposizione per ulteriori informazioni o chiarimenti.%0D%0ACordiali saluti`

    const mailSubject = "Richiesta di accesso al calendario dell'aula [inserire qui]"


        return (<Alert>
            <MailQuestionIcon className="h-4 w-4" />
            <AlertTitle>L'aula che cerchi non è in lista?</AlertTitle>
            <AlertDescription>
              <p>Questo sito utilizza i calendari ufficiali di Ateneo per mostrare le aule disponibili.</p>
              <p>Aiutaci a migliorare il servizio mandando una mail precompilata alla segreteria di Ateneo chiedendo di rendere pubblici i calendari delle aule mancanti.</p>
              <Button asChild className="w-full"><a href={`mailto:aule.ingegneria@unipv.it?cc=davide.ferrari05@universitadipavia.it&subject=${mailSubject}&body=${mailMessage}`}><SendIcon className="mr-2 h-4 w-4" />Invia email precompilata</a></Button>
            </AlertDescription>
          </Alert>);
}


export default Contacts