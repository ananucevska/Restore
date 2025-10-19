import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Најчесто поставувани прашања
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Како можам да донирам производ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                За да донирате производ, прво мора да се регистрирате и да се најавите на нашата платформа. 
                Потоа кликнете на "Додај нов производ" и пополнете ги сите потребни информации за производот што сакате да го донирате.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Како можам да добијам дониран производ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                За да добиете дониран производ, пребарајте го во каталогот и кликнете на производот што ве интересира. 
                Потоа користете го копчето "Испрати порака" за да се контактирате со донаторот и да се договорите за подигнување.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Дали донирањето е бесплатно?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Да, апсолутно! Нашата платформа е целосно бесплатна. Сите производи се донирани без надомест, 
                а корисниците не плаќаат никакви такси за користење на платформата.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Како можам да се регистрирам?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                За да се регистрирате, кликнете на "Регистрирај се" во горниот дел од страницата и пополнете го 
                формуларот со вашите лични податоци.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Дали моите лични податоци се безбедни?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Апсолутно! Ги користиме најновите безбедносни протоколи за да ги заштитиме вашите лични податоци. 
                Вашите податоци никогаш не се споделуваат со трети страни без ваша согласност.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Како функционира комуникацијата меѓу донатори и приматели?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Кога некој сака да добие дониран производ, може да испрати порака до донаторот преку вградениот систем за пораки. 
                Донаторот и примателот можат да се договорат за време и место за подигнување на производот.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Дали донаторот може да достави производ по карго?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Да, донаторот може да одбере да достави производот по карго. Кога додавате нов производ, 
                можете да изберете "Можност за испорака по карго" како опција за доставување. 
                Во овој случај, донаторот и примателот се договорат за деталите на испораката.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Не најдовте одговор на вашето прашање?
          </Typography>
          <Typography variant="body1">
            Контактирајте не директно преку нашата <a href="/contact" style={{ color: 'inherit', textDecoration: 'underline' }}>контакт страница</a> 
            или испратете ни е-маил на ana.nucevska@students.finki.ukim.mk
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
