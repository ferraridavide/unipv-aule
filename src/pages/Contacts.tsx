import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailQuestionIcon, SendIcon } from "lucide-react";
import { useState } from "react";

function Contacts() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  
    const mailMessage = `Con la presente desideriamo richiedere accesso al calendario relativo all'aula [inserire qui], al fine di integrare le informazioni sul sito https://ferraridavide.github.io/unipv-aule/.%0D%0AQuesta integrazione consentirebbe una più efficace individuazione delle aule disponibili per lo studio.%0D%0ARimaniamo a disposizione per ulteriori informazioni o chiarimenti.%0D%0ACordiali saluti`

    const mailSubject = "Richiesta di accesso al calendario dell'aula [inserire qui]"


        return (<>
        <Alert>
            <MailQuestionIcon className="h-4 w-4" />
            <AlertTitle>L'aula che cerchi non è in lista?</AlertTitle>
            <AlertDescription>
              <p>Questo sito utilizza i calendari ufficiali di Ateneo per mostrare le aule disponibili.</p>
              <p>Aiutaci a migliorare il servizio mandando una mail precompilata alla segreteria di Ateneo chiedendo di rendere pubblici i calendari delle aule mancanti.</p>
              <Button asChild className="w-full mt-2"><a href={`mailto:aule.ingegneria@unipv.it?cc=davide.ferrari05@universitadipavia.it&subject=${mailSubject}&body=${mailMessage}`}><SendIcon className="mr-2 h-4 w-4" />Invia email precompilata</a></Button>
            </AlertDescription>
          </Alert>
          <Card className="mt-4">
            <CardHeader>
        <CardTitle>Segnala un problema</CardTitle>
        <CardDescription>
          In quale area stai riscontrando problemi?
        </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="subject">Oggetto</Label>
          <Input id="subject" placeholder="Ho bisogno di aiuto con..." value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Descrizione</Label>
          <Textarea
            id="description"
            placeholder="Includi tutte le informazioni rilevanti al tuo problema."
            value={description}
                onChange={e => setDescription(e.target.value)}
          />
        </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2 items-right">
        <Button asChild><a href={`mailto:davide.ferrari05@universitadipavia.it?subject=${subject}&body=${description}`}><SendIcon className="mr-2 h-4 w-4" />Componi</a></Button>
            </CardFooter>
          </Card>
        </>
          );
}


export default Contacts