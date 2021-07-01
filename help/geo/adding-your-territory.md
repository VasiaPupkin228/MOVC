# Туториал по добавлению/изменению территории вашего государства.

## 1. Редактор
### Способ 1. Без github(если вас там нет, или не умеете пользоваться).
1. Переходим [сюда](http://geojson.io/) - это простой редактор территорий.
2. Смотрим [здесь](https://github.com/artegoser/MOVC/blob/main/geo/geo.geojson).
3. Ваша новая территория не должна занимать ту которая уже есть.
### Способ 2. C github(если вы там есть и умеете пользоваться).
1. Переходим [сюда](http://geojson.io/#id=github:artegoser/MOVC/blob/main/geo/geo.geojson) - это простой редактор территорий.
2. Смотрим тут же.
3. Ваша новая территория не должна занимать ту которая уже есть.
## 2. Добавление территорий.
1. Выбираем инструмент "полигон"  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-1.png)
2. Выделяем территорию  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-2.png)
3. Когда закончили двойной клик.  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-3.png)
4. Проверьте ваши территории. Они не должны превышать 350 000 км^2  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-info.png)
5. Поменяйте цвет вашей территории.
## 3. Изменение территорий
1. Все тоже самое как и в добавлении, но  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-edit-1.png)
2. И теперь можно изменять территорию  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-edit-2.png)
3. Чтобы сохранить нажмите save сбоку.

## 3. Добавление параметра name.
1. Нажимаем на территорию. И нажимаем add row
2. В первую колонку пишем name, во вторую id вашего государства в нашей системе.  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-name.png)

## 4. Отправка вашей территории на рассмотрение.
1. Сохраняем карту в формате geojson. Теперь будут разные способы отправки  ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-4.png) 
2. ![](https://github.com/artegoser/artegoser.github.io/raw/master/movc/docs/imgs/geo-5.png)
### Без github
1. Отправляем файл [сюда](https://vk.com/mapofvc)
### С github 
1. Выполняем pull request [в этот файл](https://github.com/artegoser/MOVC/blob/main/geo/geo.geojson)