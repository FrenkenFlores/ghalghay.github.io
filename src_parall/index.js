/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
VirtualScrolling:
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/VirtualScrolling/Knockout/Light/
Если компонент DataGrid привязан к большому набору данных, вы можете включить функцию виртуальной прокрутки, чтобы оптимизировать время загрузки данных и улучшить навигацию пользователя. Компонент вычисляет общее количество видимых строк и отображает полосу прокрутки, которая позволяет пользователям переходить к любому разделу строк. Когда пользователи отпускают ползунок прокрутки, элемент управления загружает записи для отображения в области просмотра и удаляет другие строки из памяти:
    dataSource: allData, //после dataSource: allData
            scrolling: {
                mode: "virtual"
            },          
            sorting: {		//без "none sorting"
                mode: "none"
            },
            onContentReady: function(e) {
                e.component.option("loadPanel.enabled", false);
            }


https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/InfiniteScrolling/jQuery/Light/
ВАРИАНТ с подгрузкой по мере прокрутки:
    dataSource: allData, //после dataSource: allData
        loadPanel: {
            enabled: false
        },
        scrolling: {
            mode: 'infinite'
        },
        sorting: {
            mode: "none"
        }


$(function(){
...
});
*/













//REGEX
function gCalculateFilterExpression (value, selectedFilterOperations, target, self) {
    var getter = function(data) {
        //в кириллич окружении использовать кириллич буквы с комбинируемыми символами.
        //В лат - лат буквы с комбинируемыми символами
        var data = data.normalize('NFD')

        data = data.replace(/\u0438\u0306/g, "\u0439"); //й(й)——й


        data = data.replace(/\u0435\u0308/g,"\u0451"); 	//ё(е+̈)——ё
        data = data.replace(/\u0451/g,"\u0435"); 	//ё	——е



        data = data.replace(/\u0439\u0443/g,"\u044E"); 	//йу——ю







        data = data.replace(/(\u0301|\u0300|\u0308|\u0302|\u030C|\u0304|<y><\/y>-|\u007C\u007C|<[^>]*>|\u00B6)/g,""); //¶=u00B6||̈=\u0308||    диапазон символов: [\u0300-\u036f]  [̀ - \u0300]


        //data = data.replace(/(\u04C0|\u04CF)/g, "\u0031"); /*палочки на единицу*/


        //data = data.replace(/(\u0041|\u0061)(\u0302|\u030C|\u0304|\u0306)/g,"\u0430"); 	//Ââ(â)/Ǎǎ(ǎ)/Āā(ā)/̆——а




        data = data.replace(/(\uA726)/g,"\u0048"); //Латинская заглавная буква heng НА H 
        data = data.replace(/(\uA727)/g,"\u0068"); //Латинская строчная буква heng  НА h 
        data = data.replace(/(\u00C6)/g,"\u0041"); //Латинская строчная заглавная AE Æ  НА  A
        data = data.replace(/(\u00E6)/g,"\u0061"); //Латинская строчная лигатура ae æ  НА  a



        data = data.replace(/(\d+)\u2012(\d+)/g,"$1\u002D$2"); //цифровое тире(‒) — на дефис
        data = data.replace(/\u2014/g,"\u002D"); //длинное тире(—) — на дефис

        //data = data.replace('\/\/', "\r\n"); //« // »    \u0020\u002F\u002F\u0020
        //console.log(data);
        return data;
    };




/* фриланс // add: «else if {}» */
    if (target === "filterRow") { // && selectedFilterOperations == 'contains'
        return [function(dataItem) {
            var pattern = getter(value);
            //pattern = pattern.replace(/(?<!\.)\*/g, '[\\u0400-\\u04FF\\w]*');
            pattern = pattern.replace(/\\b/g, '(?=\\s|[^\\u0400-\\u04FF\\w]|\\b|$)');
            pattern = pattern.replace(/@/g, '[\\u0400-\\u04FF\\w]');
            pattern = pattern.replace(/,,/g, '.*');
            pattern = pattern.replace(/,/g, '[\\u0400-\\u04FF\\w]*');


            pattern = pattern.replace(/</g, '(аь|яь|а|е|ё|и|о|у|ы|э|ю|я)');
            pattern = pattern.replace(/>/g, '(гӀ|кх|къ|кӀ|пӀ|тӀ|хь|хӀ|цӀ|чӀ|б|в|г|д|ж|з|й|к|л|м|н|п|р|с|т|ф|х|ц|ч|ш|щ|ъ|ь|Ӏ)');


            if (selectedFilterOperations == 'contains')
                pattern = `(^|\\s|[^\\u0400-\\u04FF\\w]|\\b)${pattern}`;
            else
                 pattern = `(^|\\s|[^\\u0400-\\u04FF\\w]|\\b)${pattern}(?=\\s|[^\\u0400-\\u04FF\\w]|\\b|$)`;
            pattern = new RegExp(pattern, 'miu');
            var cell = getter(dataItem[self.dataField]);
            if (cell.match(pattern)) {
                return true;
            } else {
                return false;
            }
        }, "=", true];
    } else {
        return [function(dataItem) {
            return getter(dataItem[self.dataField]);
        }, selectedFilterOperations || 'contains', value];
    }
}



/*до-фриланс*/
/*
    if (target === "filterRow" && selectedFilterOperations == 'contains') // && selectedFilterOperations == 'contains'
    {
        return [function(dataItem)
        {
            var pattern = new RegExp(getter(value), 'i'),
                cell = getter(dataItem[self.dataField]);
            if (cell.match(pattern))
            {
                return true;
            }
            else
            {
                return false;
            }
        }, "=", true];
    }
    else
    {
        return [function(dataItem) { return getter(dataItem[self.dataField]); }, selectedFilterOperations || 'contains', value];
    }
}
*/



/*
//REGEX отдельно 
function gCalculateFilterExpression (value, selectedFilterOperations, target, self) {  
        if (target === "filterRow") {
            return [function(dataItem) {
        var pattern = new RegExp(value, 'i');
        if (dataItem[self.dataField].match(pattern)) {  
                    return true;  
                }  
                else {
                    return false;  
                }  
            }, "=", true];  
        }  
        else {  
            return self.defaultCalculateFilterExpression.apply(self, arguments);  
        }  
    }
*/


/*
//REGEX отдельно (ВАРИАНТ)
calculateFilterExpression: function (filterValue, selectedFilterOperation, target) {
    const columnField = this.dataField;
    var getter = function (data) {                                                 
        return data[columnField].normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>-|\u007C\u007C|<[^>]*>)/g, "").replace(/\u0451/g,"\u0435");  
    };
    filterValue = filterValue.normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>-|\u007C\u007C|<[^>]*>)/g, "").replace(/\u0451/g,"\u0435");
    return [getter, selectedFilterOperation || "contains", filterValue];
}
*/









//https://supportcenter.devexpress.com/Ticket/Details/T380360/dxdatagrid-nodatatext-into-a-link
//var nodata = [];  //ссылка для nodata №1

$(function(){
  $('#gridContainer').dxDataGrid({
    encodeHtml: true,


    //hide-columns-onContextMenu
    onContextMenuPreparing: function(e) {  
        if (e.target == "header") {
            // e.items can be undefined
            if (!e.items) e.items = [null]; //Add: null
 
            // Add a custom menu item
            e.items.push({
                text: "Скрыть столбец",
                onItemClick: function() {
                    e.component.columnOption(e.column.caption, 'visible', false);
                }
            });
        } 
    },

    //Zebra
    rowAlternationEnabled: true,

    //??showTotalsPrior       : "both",

/*
    paging: {pageSize: 10},
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [10, 25, 50, 100]
    },
*/

    dataSource: allData,
        columnsAutoWidth: true,
        showBorders: true,
        loadPanel: {
            enabled: true
        },
    //filterPanel: {visible: true}, //не ищет по рег.в.
//REGEX - для обновления результатов
    cacheEnabled: false,
//ColumnReordering
    allowColumnReordering: true,
//ColumnResizing
    allowColumnResizing: true,
    showBorders: true,
    columnResizingMode: "nextColumn",
    columnMinWidth: 44,
    columnAutoWidth: true,
/*
//Export to Excel <script src="jszip.min.js"></script>
    selection: {mode: "multiple"},
    export: {
        enabled: true,
        fileName: "a",
        allowExportSelectedData: true
    },
*/

    //groupPanel: {visible: true},

    columnChooser: {enabled: true, mode: "select"},

/*
    columnHidingEnabled: true,
    showBorders: true,
    grouping: {
        contextMenuEnabled: true,
        expandMode: "rowClick"
    },   
    groupPanel: {
        emptyPanelText: "Use the context menu of header columns to group data",
        visible: true
    },
    pager: {
        allowedPageSizes: [5, 8, 15, 30],
        showInfo: true,
        showNavigationButtons: true,
        showPageSizeSelector: true,
        visible: true
    },
    paging: {
        pageSize: 8
    },
*/

    selection: {mode: "single"}, //"multiple"
    scrolling: {mode: "virtual"}, //"infinite"
            
    //onContentReady: function(e) { //после отрисовки страницы
    //},
    searchPanel: {
        encodeHtml: false,
        visible: true,
        width: 218,
        placeholder: "↑ Глобальный поиск…"


/*
    //удаление акцентов, тегов - для отдельного использования
    calculateFilterExpression: function(value, selectedFilterOperation, target){
    var getter = function(data) {
        var data  = data['a'].normalize('NFD').replace(/\u0451/g,"\u0435"); //ё—е
        return data;
    };
    value = value.normalize('NFD').replace(/\u0451/g,"\u0435"); //ё—е
    return [getter, selectedFilterOperation || "contains", value];
    }
*/


    },
/*
    editing: {
        editMode: "batch",
        editEnabled: true,
        removeEnabled: true,
        insertEnabled: true
    },
*/
    filterRow: {
        encodeHtml: false,
        visible: true,
        applyFilter: "auto"
    },
    headerFilter: {
        encodeHtml: false,
        visible: true
    },
    columns: [
    {
        placeholder: "↓ Фильтр (RegEx)…",
        allowHeaderFiltering: false,
        //allowFiltering: false,
        //headerFilter: false,
        //allowSorting: false,
        encodeHtml: false,
        width: '46%',
        dataField: 'b',
        allowSorting: false,
        caption: 'Инг.',
        //caption: '<ing>',
        headerCellTemplate: function (header, info) {
            $('<div>')
                .html(info.column.caption)
                //.css('font-size', '16px')
                .appendTo(header);
        },
        cssClass: "b", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"

/*
        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.b){
             var text = rowData.b.replace(/#/g,"");
             //text = text.replace(/(—)/g, "–");  //длинное тире — на среднее
             return text;
           }
        },
*/

        //sortOrder: 'asc', //undefined | 'asc' | 'desc'
        filterOperations: ['contains','='],
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        }
    },
    {
        placeholder: "↓ Фильтр (RegEx)…",
        allowHeaderFiltering: false,
        encodeHtml: false,
        width: '48%',
        dataField: 'd',
        allowSorting: false,
        caption: 'Рус.',
        //caption: '<rus>',
        headerCellTemplate: function (header, info) {
            $('<div>')
                .html(info.column.caption)
                //.css('font-size', '16px')
                .appendTo(header);
        },
        cssClass: "d", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"

/*
        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.d){         
             var text = rowData.d.replace(/(—)/g, "–");  //длинное тире — на среднее
             return text;         
           }
        },
*/


/*
        //удаление акцентов, тегов - на месте
        calculateFilterExpression: function(value, selectedFilterOperations, target){  
            var getter = function(data) {  
              var data = data['d'].normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>-|\u007C\u007C|<[^>]*>)/g,"444").replace(/\u0451/g,"\u0435"); //¶||
              //data = data.replace(/\u0451/g,"\u0435"); //ё—е







              //data = data.replace('\/\/', "\r\n"); //« // »    \u0020\u002F\u002F\u0020
              //...
              return data;
            };  
 
            value = value.normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>-|\u007C\u007C|<[^>]*>)/g,"444").replace(/\u0451/g,"\u0435"); //¶||
            value = value.replace(/\u0451/g,"\u0435"); //ё—е
 
            return [getter, selectedFilterOperations || "contains", value];  
        },
*/




        //ссылка на функцию с REGEX
        filterOperations: ['contains','='],
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        },






    },
    {
        placeholder: "↓ Фильтр…",
        //allowFiltering: false,
        //headerFilter: false,
        //allowSorting: false,
        encodeHtml: false,
        width: '6%',
        dataField: 'e',
        allowSorting: false,
        //alignment: "right",  //!!
        caption: 'Источники',
        cssClass: "e", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"
    }
/* ,
    {
        encodeHtml: false,
        width: '12%',
        dataField: 'c',
        caption: '#3',
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        },
        cssClass: "cell-highlighted" //Задает класс CSS, применяемый к ячейкам:
                                     //.dx-data-row .cell-highlighted {
    },
    {
        //cssClass: "znachenie" //Задает класс CSS, применяемый к ячейкам:
                                     //.dx-data-row .cell-highlighted {
        //allowSorting: false,
        encodeHtml: false,
        width: '53%',
        dataField: 'd',
        caption: '#4',
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        }
      }
*/
    ],
        summary: {totalItems: [{column: "b", summaryType: "count"}]},		//Total Summaries



    onContentReady: function(e) { //после отрисовки страницы
        e.component.option("loadPanel.enabled", false);



        $('#id_input').attr('placeholder', 'Глобальный поиск…');






        //$('tr td:first-child ant21').closest('td').css('background-color', '#000000').addClass('ant21');
        // ...




  /* https://supportcenter.devexpress.com/ticket/details/t380360/dxdatagrid-nodatatext-into-a-link */
        var noDataSpan = e.component.element().find(".dx-datagrid-nodata");
        //var hyperlink = $('<a href="about.html" class="dx-datagrid-nodata" style="z-index:3" target="blank">Не найдено</a>');
        var hyperlink = $('<div class="dx-datagrid-nodata" style="z-index:3;text-align:center;font-size:16px;">Не найдено<br><br><img width="250" height="250" src="src/img/search.png" onclick="window.open(this.src)" style="padding: 5px;">').attr('class', noDataSpan.attr('class'));  
        noDataSpan.replaceWith(hyperlink);
/*<a href="about.html" target="blank">*/



/* <br><div style="text-align:left; font-size:13px;"><table class="dx-nodata" align="center" valign="top" cellpadding="0pt"><tr><td colspan="2" width="100">Верхние фильтры <r>&uarr;</r> ведут поиск внутри колонок<br>в начальной позиции слов (по умолчанию),<br>или (при выборе опции слева от фильтра) по<br><r2>целым словам</r2> с использованием спец. знаков:</td></tr><tr><td>&nbsp;</td></tr><tr><td class="nd-code" width="27">@</td><td>— соответствует любой одной букве в слове</td></tr><tr><td class="nd-code">&nbsp;,</td><td>— нулю или более неизвестных букв в слове</td></tr><tr><td class="nd-code">&nbsp;,,</td><td>— любому количеству произвольных знаков</td></tr><tr><td>&nbsp;</td></tr><tr><td class="nd-code">АЗ</td><td>— найти целые слова <code>АЗ</code></td></tr><tr><td class="nd-code">АЗ / АЗ,</td><td>— найти слова, начинающиеся на <code>АЗ</code></td></tr><tr><td class="nd-code">,АЗ</td><td>— найти оканчивающиеся на <code>АЗ</code></td></tr><tr><td class="nd-code">,АЗ,</td><td>— найти содержащие <code>АЗ</code> в середине</td></tr><tr><td class="nd-code">А,З</td><td>— найти слова с <code>А</code> в начале и <code>З</code> в конце</td></tr><td>&nbsp;</td></tr><tr><td colspan="2" width="100%">Закреплённый внизу <r>&darr;</r> <r2>простой</r2> поиск, ищет<br>соответствия по всей таблице и в любой<br>позиции текста. <i>Подробнее см. «<u onclick="location.href=\'about.html\'">О проекте</u>»</i>.</td></tr><tr></table></div></div> */





/* https://supportcenter.devexpress.com/ticket/details/t380360/dxdatagrid-nodatatext-into-a-link */
/*
$(window).on('resize', function(){  
    $("#gridContainer").dxDataGrid('instance').repaint();  
});
*/






    },







/*
        grouping: {
            contextMenuEnabled: true
        },
        groupPanel: {
            visible: true   // or "auto"
        }
*/
  });
});






//[ΙIl1]Ӏ	———	dx.all.js	———	<input onkeyup='fix(this)' type='text' minlength='1' required title='' class='md-input' placeholder='S'>
function fix(obj) {


/*
   obj.value = obj.value.replace(/[áàâǎăãảạäåāąấầẫẩậắằẵẳặǻ]/g, 'а');
   obj.value = obj.value.replace(/[éèêěĕẽẻėëēęếềễểẹệ]/g, 'е');
   obj.value = obj.value.replace(/[óòŏôốồỗổǒöőõøǿōỏơớờỡởợọộ]/g, 'о');
*/
   obj.value = obj.value.replace(/[́̀]/g, '');





   //палочки на единицу:  data = data.replace(/(\u04C0|\u04CF)/g, "\u0031");

   //obj.value = obj.value.replace(/[ΙIl1][ΙIl1]([Ӏ,@\.йцукенгшщзхъфывапролджэячсмитьбюё])/g, 'ӀӀ$1');
   //obj.value = obj.value.replace(/[ΙIl1][ΙIl1]([Ӏ,@\.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ])/g, 'ӀӀ$1');

   obj.value = obj.value.replace(/([Ӏ,@\.а-яёА-ЯЁ])[ΙIl1]/g, '$1Ӏ');
   obj.value = obj.value.replace(/[ΙIl1]([Ӏ,@\.а-яёА-ЯЁ])/g, 'Ӏ$1');


//https://ikfi.ru/article/granica-slova-b-i-kirillica-v-javascript
//var rx_string = "(^|\\s|[^\\u0400-\\u04FF]|\\b)" + item.replace(".", "\\.") + "(?=\\s|[^\\u0400-\\u04FF]|\\b|$)";

/*
   obj.value = obj.value.replace(/([^\\|\.])[\*,]/g, "$1\(\[a-zа-яёӀl1IΙ\]\+\)\?");

   obj.value = obj.value.replace('\\\\\\', "(^|\\s|[^\\u0400-\\u04FF]|\\b)");
   obj.value = obj.value.replace('\/\/\/', "(?=\\s|[^\\u0400-\\u04FF]|\\b|$)");
*/
   obj.value = obj.value.replace('БББ', "<");
   obj.value = obj.value.replace('ЮЮЮ', ">");


}


