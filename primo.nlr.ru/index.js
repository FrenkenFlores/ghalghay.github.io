

//REGEX
function gCalculateFilterExpression (value, selectedFilterOperations, target, self) {
    var getter = function(data) {
        //в кириллич окружении использовать кириллич буквы с комбинируемыми символами.
        //В лат - лат буквы с комбинируемыми символами
        var data = data.normalize('NFD')

        data = data.replace(/\u0438\u0306/g, "\u0439"); //й(й)——й


        data = data.replace(/\u0435\u0308/g,"\u0451"); 	//ё(е+̈)——ё
        data = data.replace(/\u0451/g,"\u0435"); 	//ё	——е



        return data;
    };




/* фриланс // add: «else if {}» */
    if (target === "filterRow") { // && selectedFilterOperations == 'contains'
        return [function(dataItem) {
            var pattern = getter(value);
            //if (pattern == prevValue) {pattern = prevPattern;} else {prevValue = pattern; //Alex_Piggy add
            //pattern = pattern.replace(/(?<!\.)\*/g, '[\\u0400-\\u04FF\\w]*');
            pattern = pattern.replace(/\\b/g, '(?=\\s|[^\\u0400-\\u04FF\\w]|\\b|$)');
            pattern = pattern.replace(/@/g, '[\\u0400-\\u04FF\\w]');
            pattern = pattern.replace(/,,/g, '.*');
            pattern = pattern.replace(/,/g, '[\\u0400-\\u04FF\\w]*');






            if (selectedFilterOperations == 'contains')
                pattern = `(^|\\s|[^\\u0400-\\u04FF\\w]|\\b)${pattern}`;
            else
                 pattern = `(^|\\s|[^\\u0400-\\u04FF\\w]|\\b)${pattern}(?=\\s|[^\\u0400-\\u04FF\\w]|\\b|$)`;
            pattern = new RegExp(pattern, 'miu');
            //prevPattern = pattern;} //Alex_Piggy add
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



$(function(){
  $('#gridContainer').dxDataGrid({
    encodeHtml: true,


    /* скрытие опред-ных столбцов по классу, когда экран меньше... */
    customizeColumns(col) {
        col.forEach(arr => {
            if (screen.width <= 700) {
                if (arr.cssClass === "b" || arr.cssClass === "d" || arr.cssClass === "e") {
                    arr.visible = false;
                    $('.dx-datagrid-header-panel .dx-button-mode-contained').closest('div').css('background-color', '#FFC0C7').addClass('dx-button-mode-contained');
                }
            }
        });
    },





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
    columnMinWidth: 28,
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




    /* АДАПТИВНОСТЬ, см hidingPriority */
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
    },
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
        //hidingPriority: 1, //приоритет для адаптивности
        //allowFiltering: false,
        //headerFilter: false,
        //allowSorting: false,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '3%',
        dataField: 'a',
        alignment: "right",
        caption: 'Язык'
    },
    {
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '3%',
        dataField: 'b',
        caption: 'Страна'
    },
    {
        allowHeaderFiltering: false,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '36%',
        dataField: 'c',
        caption: 'Заглавие'
    },
    {
        allowHeaderFiltering: false,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '16%',
        dataField: 'c2',
        caption: 'Пepeвoд зaглавия'
    },
    {
        allowHeaderFiltering: false,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '20%',
        dataField: 'f',
        caption: 'Имена лиц'
    },
    {
        allowHeaderFiltering: false,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '9%',
        dataField: 'd',
        caption: 'Вых.данные'
    },
    {
        allowHeaderFiltering: true,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '4%',
        dataField: 'd2',
        caption: 'Год'
    },
    {
        allowHeaderFiltering: false,
        placeholder: "↓ Фильтр…",
        encodeHtml: false,
        width: '9%',
        dataField: 'e',
        caption: 'Физ.хар-ки',

        filterOperations: ['contains','='],
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        }

    }
    ],
        summary: {totalItems: [{column: "c", summaryType: "count"}]},		//Total Summaries






    onContentReady: function(e) { //после отрисовки страницы
        e.component.option("loadPanel.enabled", false);


//$('#id_input').attr('placeholder', 'Глобальный поиск…');










  /* https://supportcenter.devexpress.com/ticket/details/t380360/dxdatagrid-nodatatext-into-a-link */
        var noDataSpan = e.component.element().find(".dx-datagrid-nodata");
        //var hyperlink = $('<a href="about.html" class="dx-datagrid-nodata" style="z-index:3" target="blank">Не найдено</a>');
        var hyperlink = $('<div class="dx-datagrid-nodata" style="z-index:3;text-align:center;font-size:16px;">Не найдено<br>').attr('class', noDataSpan.attr('class'));  
        noDataSpan.replaceWith(hyperlink);
/*<a href="about.html" target="blank">*/


    },


  });
});






//[ΙIl1]Ӏ	———	dx.all.js	———	<input onkeyup='fix(this)' type='text' minlength='1' required title='' class='md-input' placeholder='S'>
function fix(obj) {


}


