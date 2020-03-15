let shops = [
    {
        name: 'ООО "Джаст Мебель"',
        address: 'Железнодорожная улица 19, Минск 220089',
        coordinates: [53.877438, 27.509512],
        domain: 'https://mebel-market.by/',
        gallery: ['assets/img/Just_furniture/1.jpg', 'assets/img/Just_furniture/2.jpg', 'assets/img/Just_furniture/3.jpg', 'assets/img/Just_furniture/4.jpg', 'assets/img/Just_furniture/5.jpg'],  
        id: 1
    },

    {
        name: 'Мягкая мебель Divanby_com',
        address: 'улица Маяковского 14, Минск 220006',
        coordinates: [53.8963078, 27.5239031],
        domain: 'https://divanby.com/',
        gallery: ['assets/img/Divanby/1.jpg', 'assets/img/Divanby/2.jpg', 'assets/img/Divanby/3.jpg', 'assets/img/Divanby/4.jpg', 'assets/img/Divanby/5.jpg'],
        id: 2
    },

    {
        name: 'Центр мебели и интерьера "КАМЕЛОТ"',
        address: 'ул. Мазурова д. 1, Минск 220136',
        coordinates: [53.8947928, 27.4336123],
        domain: 'https://camelotmebel.by/',
        gallery: ['assets/img/Camelot/1.jpg', 'assets/img/Camelot/2.jpg', 'assets/img/Camelot/3.jpg', 'assets/img/Camelot/4.jpg', 'assets/img/Camelot/5.jpg'],
        id: 3
    },

    {
        name: 'Салон польской мебели Atlas',
        address: 'Логойский тракт 25/1, Минск',
        coordinates: [53.9505046, 27.6156378],
        domain: 'https://salonatlas-minsk.business.site/',
        gallery: ['assets/img/Atlas/1.jpg', 'assets/img/Atlas/2.jpg', 'assets/img/Atlas/3.jpg', 'assets/img/Atlas/4.jpg', 'assets/img/Atlas/5.jpg'],
        id: 4
    },

    {
        name: 'Дом Мебели',
        address: 'улица Солтыса 187а, Минск 220070',
        coordinates: [53.9046542, 27.6421809],
        domain: 'https://dommebeliminsk.by/',
        gallery: ['assets/img/Furniture_house/1.jpg', 'assets/img/Furniture_house/2.jpg', 'assets/img/Furniture_house/3.jpg', 'assets/img/Furniture_house/4.jpg', 'assets/img/Furniture_house/5.jpg'],
        id: 5
    },

    {
        name: 'Минскмебель',
        address: 'В. Хоружей 25, Минск 220123',
        coordinates: [53.9217671, 27.5638175],
        domain: 'https://minskmebel.by/',
        gallery: ['assets/img/Minskmebel/1.jpg', 'assets/img/Minskmebel/2.jpg', 'assets/img/Minskmebel/3.jpg', 'assets/img/Minskmebel/4.jpg', 'assets/img/Minskmebel/5.jpg'],
        id: 6
    },

    {
        name: 'Магазин мебели Danko',
        address: 'ул. Платонова 22, Минск',
        coordinates: [53.9107974, 27.5964546],
        domain: 'http://danko.by/',
        gallery: ['assets/img/Danko/1.jpg', 'assets/img/Danko/2.jpg', 'assets/img/Danko/3.jpg', 'assets/img/Danko/4.jpg', 'assets/img/Danko/5.jpg'],
        id: 7
    },

    {
        name: 'Магазин мебели Андрия',
        address: 'ул. Жилуновича, 22, оф. 6',
        coordinates: [53.865489, 27.606352],
        domain: 'https://andriya-mebel.by/',
        gallery: ['assets/img/Andria/1.jpg', 'assets/img/Andria/2.jpg', 'assets/img/Andria/3.jpg', 'assets/img/Andria/4.jpg', 'assets/img/Andria/5.jpg'],
        id: 8
    }
];

var myMap;

ymaps.ready(init);
function init () {
    myMap = new ymaps.Map('map', {
        center: [53.902512, 27.561481], 
        zoom: 11,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });
    fillStoreSelectors();
    drawMarkers();

    //событие при выборе маркера на карте
    myMap.geoObjects.events.add('click', function (event) {
        var object = event.get('target');
        const coordinates = object.geometry._coordinates;
        const selectedShop = shops.find(function(shop){
            if ((shop.coordinates[0] === coordinates[0]) && (shop.coordinates[1] === coordinates[1])){
                return true;
            } 
        });
        drawPopUp(selectedShop);
        dischargeSelected();
        document.querySelector('.store_selection select option[value="' + selectedShop.id + '"]').setAttribute('selected', '');
    });

    //событие при выборе из выпадающего списка
    document.querySelector('.store_selection select').addEventListener('change', function(event){
        const idShop = +event.target.selectedOptions[0].value; //возвращает id shops
        const selectedShop = shops.find(function(shop){
            if (shop.id === idShop){
                return true;
            } else {
                myMap.setCenter([53.902512, 27.561481], 11, {
                duration: 300
                });
                closePopUp();
            }
        });
        if (!!selectedShop == true){
            dischargeSelected();
            drawPopUp(selectedShop);
        }
    });

    document.querySelector('.store_description .pop_up button').addEventListener('click', function(){
        closePopUp()
    }); 
}

function fillStoreSelectors(){ //функция записи названий магазинов в опции
    let acum = '<option>Магазины</option>';
    for (let i = 0; i < shops.length; i++){
        let shopName = shops[i].name;
        acum += '<option value="' + shops[i].id + '">' + shopName + '</option>'
    }
    document.querySelector('.store_selection select').innerHTML = acum;
}

function drawMarkers(){ //рисует маркеры на карте
    for (let i = 0; i < shops.length; i++){
        let coordinates = shops[i].coordinates;
        let shopName = shops[i].name;
        myMap.geoObjects.add(new ymaps.Placemark(coordinates, {
            
        }, {
            preset: 'islands#greenDotIconWithCaption'
        }));
    }
}

function drawPopUp(shop){ 
    document.querySelector('.store_description .pop_up .shop_address .address').innerHTML = shop.address;
    document.querySelector('.store_description .pop_up .shop_name .name').innerHTML = shop.name;
    document.querySelector('.store_description .pop_up .web_site a').innerHTML = shop.domain;
    document.querySelector('.store_description .pop_up .web_site a').setAttribute('href', shop.domain);
    myMap.setCenter(shop.coordinates, 14, {
        duration: 300
    });
    let acum = '<div class="carousel-item active"><img src=' + shop.gallery[0] + ' class="d-block w-100"></div>';;
    for (let i = 1; i < shop.gallery.length; i++){
        acum += '<div class="carousel-item"><img src=' + shop.gallery[i] + ' class="d-block w-100"></div>';
    };
    document.querySelector('.store_description .pop_up .carousel-inner').innerHTML = acum;
    document.querySelector('.store_description').classList.add('on');
    
    const selectedShopIndex = shops.findIndex(s => s.id === shop.id); 
    document.querySelector('.store_selection select').selectedIndex = selectedShopIndex + 1; 
}
    


function closePopUp(){
    document.querySelector('.store_description').classList.remove('on');

    myMap.setCenter([53.902512, 27.561481], 11, {
        duration: 400
    });
    dischargeSelected();
    document.querySelector('.store_selection select option').setAttribute('selected', '');
}

function dischargeSelected(){
    let massOption = document.querySelector('.store_selection select').children;
    for (let i = 0; i < massOption.length; i++){
        if (massOption[i].hasAttribute('selected')){
            massOption[i].removeAttribute('selected');
        } 
    }
}


