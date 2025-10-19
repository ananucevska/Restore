export const skopjeMunicipalities = [
    // Општини во Град Скопје
    'Аеродром',
    'Арачиново',
    'Бутел',
    'Гази Баба',
    'Ѓорче Петров',
    'Зелениково',
    'Илинден',
    'Карпош',
    'Кисела Вода',
    'Петровец',
    'Сарај',
    'Сопиште',
    'Чаир',
    'Шуто Оризари',
    'Центар'
];

export const getSkopjeMunicipalityOptions = () => {
    return skopjeMunicipalities.map(municipality => ({
        value: municipality,
        label: municipality
    }));
};