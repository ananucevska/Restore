import { Container, Typography, Box, Paper } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Политика на приватност
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Овој сегмент опишува како ги собираме, користиме и заштитуваме вашите лични податоци 
            кога ја користите нашата платформа за донирање. Вашата приватност е важна за нас и се обврзуваме да ги заштитиме 
            вашите лични податоци.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Податоци што ги собираме
          </Typography>
          <Typography variant="body1" paragraph>
            Може да собираме различни видови информации од вас, вклучувајќи:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
            <li>Лични информации (име, е-маил адреса, телефонски број)</li>
            <li>Информации за донираните предмети</li>
            <li>Информации за користење на платформата</li>
            <li>Cookies и слични технологии</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Како ги користиме вашите податоци
          </Typography>
          <Typography variant="body1" paragraph>
            Вашите лични податоци ги користиме за:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
            <li>Организирање на донирање на предмети</li>
            <li>Комуникација меѓу донатори и приматели</li>
            <li>Подобрување на нашата платформа</li>
            <li>Соодветни правни и регулаторни барања</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Заштита на податоци
          </Typography>
          <Typography variant="body1" paragraph>
            Ги спроведуваме соодветни безбедносни мерки за да ги заштитиме вашите лични податоци од неовластен 
            пристап, измена, откривање или уништување.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Вашите права
          </Typography>
          <Typography variant="body1" paragraph>
            Имате право да:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
            <li>Пристапите до вашите лични податоци</li>
            <li>Побарате исправка на неточни податоци</li>
            <li>Побарате бришење на вашите податоци</li>
            <li>Се повлечете од обработката на податоци</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Контакт
          </Typography>
          <Typography variant="body1" paragraph>
            Ако имате прашања за оваа политика на приватност, ве молиме контактирајте не на:
          </Typography>
          <Typography variant="body1">
            Е-маил: ana.nucevska@students.finki.ukim.mk
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
