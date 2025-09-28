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
              <Typography variant="h6">Како можам да направам нарачка?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                За да направите нарачка, прво мора да се регистрирате и да се најавите на нашата веб-страница. 
                Потоа изберете го производот што го сакате, додајте го во кошничката и следете ги чекорите за завршување на нарачката.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Колку време треба за испорака?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Стандардната испорака трае 3-5 работни дена. За брза испорака (1-2 дена) има дополнителна надомест. 
                Времето на испорака може да се разликува во зависност од локацијата.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Дали примате враќање на пари?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Да, примаме враќање на пари во рок од 14 дена од примањето на нарачката, под услов производот 
                да биде во оригинална состојба и да не е користен.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Кои се начините на плаќање?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Примаме плаќање со кредитни карти, дебитни карти, банкарски трансфер и плаќање при испорака. 
                Сите плаќања се безбедни и заштитени.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Како можам да го следам статусот на мојата нарачка?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Можете да го следите статусот на вашата нарачка во вашиот профил, во секцијата "Мои нарачки". 
                Ќе добиете и е-маил известувања за секоја промена во статусот.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Дали имате клиентска поддршка?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Да, нашата клиентска поддршка е достапна 24/7 преку е-маил, телефон и живиот чат на нашата веб-страница. 
                Ќе ви одговориме во најкраток можен рок.
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
                формуларот со вашите лични податоци. Ќе добиете потврда на вашата е-маил адреса.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Дали моите лични податоци се безбедни?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Апсолутно. Ги користиме најновите безбедносни протоколи за да ги заштитиме вашите лични податоци. 
                Вашите податоци никогаш не се споделуваат со трети страни без ваша согласност.
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
            или испратете ни е-маил на support@example.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
