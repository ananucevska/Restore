import { CategoryMenu } from '../models/category';

export const categoryMenu: CategoryMenu = {
  categories: [
    {
      id: 'furniture',
      label: 'Мебел',
      value: 'Furniture',
      subcategories: [
        {
          id: 'chairs',
          label: 'Столици',
          value: 'Chairs',
        },
        {
          id: 'tables',
          label: 'Маси',
          value: 'Tables',
        },
        {
          id: 'sofas',
          label: 'Каучи',
          value: 'Sofas',
        },
        {
          id: 'beds',
          label: 'Кревети',
          value: 'Beds',
        },
        {
          id: 'wardrobes',
          label: 'Гардеробери',
          value: 'Wardrobes',
        },
        {
          id: 'shelves',
          label: 'Полици',
          value: 'Shelves',
        },
      ],
    },
    {
      id: 'appliances-electronics',
      label: 'Апарати и електроника',
      value: 'Appliances & Electronics',
      subcategories: [
        {
          id: 'kitchen-appliances',
          label: 'Кујнски апарати',
          value: 'Kitchen Appliances',
        },
        {
          id: 'home-appliances',
          label: 'Апарати за домот',
          value: 'Home Appliances',
        },
        {
          id: 'electronics',
          label: 'Електроника',
          value: 'Electronics',
        },
        {
          id: 'computer-components',
          label: 'Компјутерски компоненти',
          value: 'Computer components',
        },
      ],
    },
    {
      id: 'home-kitchen',
      label: 'Дом и кујна',
      value: 'Home & Kitchen',
      subcategories: [
        {
          id: 'pans',
          label: 'Тави',
          value: 'Pans',
        },
        {
          id: 'pots',
          label: 'Тенџериња',
          value: 'Pots',
        },
        {
          id: 'dishes',
          label: 'Чинии',
          value: 'Dishes',
        },
        {
          id: 'cutlery',
          label: 'Прибор за јадење',
          value: 'Cutlery',
        },
        {
          id: 'bedding',
          label: 'Постелнина',
          value: 'Bedding',
        },
        {
          id: 'pillows',
          label: 'Перници',
          value: 'Pillows',
        },
        {
          id: 'curtains',
          label: 'Завеси',
          value: 'Curtains',
        },
        {
          id: 'carpets',
          label: 'Теписи',
          value: 'Carpets',
        },
      ],
    },
    {
      id: 'clothing-accessories',
      label: 'Облека и додатоци',
      value: 'Clothing & Accessories',
      subcategories: [
        {
          id: 'clothing',
          label: 'Облека',
          value: 'Clothing',
          tags: [
            {
              id: 'male',
              label: 'Машка',
              value: 'Male',
            },
            {
              id: 'female',
              label: 'Женска',
              value: 'Female',
            },
          ],
        },
        {
          id: 'shoes',
          label: 'Чевли',
          value: 'Shoes',
          tags: [
            {
              id: 'male',
              label: 'Машки',
              value: 'Male',
            },
            {
              id: 'female',
              label: 'Женски',
              value: 'Female',
            },
          ],
        },
        {
          id: 'bags',
          label: 'Ташни',
          value: 'Bags',
        },
        {
          id: 'accessories',
          label: 'Додатоци',
          value: 'Accessories',
        },
      ],
    },
    {
      id: 'baby-kids',
      label: 'Бебиња и деца',
      value: 'Baby & Kids',
      subcategories: [
        {
          id: 'toys',
          label: 'Играчки',
          value: 'Toys',
        },
        {
          id: 'strollers',
          label: 'Колички',
          value: 'Strollers',
        },
        {
          id: 'cribs',
          label: 'Кревети за бебе',
          value: 'Cribs',
        },
        {
          id: 'kids-clothes',
          label: 'Детска облека',
          value: 'Kids Clothes',
          tags: [
            {
              id: 'male',
              label: 'Машка',
              value: 'Male',
            },
            {
              id: 'female',
              label: 'Женска',
              value: 'Female',
            },
          ],
        },
        {
          id: 'baby-clothes',
          label: 'Бебешка облека',
          value: 'Baby Clothes',
          tags: [
            {
              id: 'male',
              label: 'Машка',
              value: 'Male',
            },
            {
              id: 'female',
              label: 'Женска',
              value: 'Female',
            },
          ],
        },
        {
          id: 'school-supplies',
          label: 'Школски материјали',
          value: 'School Supplies',
        },
      ],
    },
    {
      id: 'books-media',
      label: 'Книги и медиуми',
      value: 'Books & Media',
      subcategories: [
        {
          id: 'books',
          label: 'Книги',
          value: 'Books',
        },
        {
          id: 'magazines',
          label: 'Списанија',
          value: 'Magazines',
        },
        {
          id: 'board-games',
          label: 'Друштвени игри',
          value: 'Board Games',
        },
        {
          id: 'cds-dvds',
          label: 'CD/DVD',
          value: 'CDs/DVDs',
        },
      ],
    },
    {
      id: 'sports-outdoors',
      label: 'Спорт и активности на отворено',
      value: 'Sports & Outdoors',
      subcategories: [
        {
          id: 'bicycles',
          label: 'Велосипеди',
          value: 'Bicycles',
        },
        {
          id: 'exercise-equipment',
          label: 'Опрема за вежбање',
          value: 'Exercise Equipment',
        },
        {
          id: 'camping-gear',
          label: 'Опрема за кампување',
          value: 'Camping Gear',
        },
      ],
    },
    {
      id: 'tools-diy',
      label: 'Алати и занаетчиство',
      value: 'Tools & DIY',
      subcategories: [
        {
          id: 'hand-tools',
          label: 'Рачни алати',
          value: 'Hand Tools',
        },
        {
          id: 'gardening-tools',
          label: 'Градинарски алати',
          value: 'Gardening Tools',
        },
        {
          id: 'construction-equipment',
          label: 'Градежна опрема',
          value: 'Construction Equipment',
        },
      ],
    },
    {
      id: 'miscellaneous',
      label: 'Разно / Друго',
      value: 'Miscellaneous / Other',
    },
  ],
  filters: [
    {
      id: 'condition',
      label: 'Состојба',
      value: 'Condition',
      options: [
        {
          id: 'like-new',
          label: 'Како ново',
          value: 'Like New',
        },
        {
          id: 'good',
          label: 'Добро сочувано',
          value: 'Good',
        },
        {
          id: 'functional',
          label: 'Функционално',
          value: 'Functional',
        },
      ],
    },
    {
      id: 'delivery',
      label: 'Опции за подигнување/достава',
      value: 'Pickup/Delivery Options',
      options: [
        {
          id: 'pickup-only',
          label: 'Лично подигнување',
          value: 'Pick up only',
        },
        {
          id: 'can-deliver',
          label: 'Можност за испорака по карго',
          value: 'Can deliver',
        },
      ],
    },
  ],
};
