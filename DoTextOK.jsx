// DoTextOK 2102
// Вся информация о том, как работать с этой программой подготовки текста к вёрстке, размещена на сайте adobeindesign.ru:  http://adobeindesign.ru/2012/04/22/dotextok-2012/
// © Михаил Иванюшин, 2012  ivanyushin#yandex.ru

/*
С дополнениеями Константина Смородского:

- выполнение скрипта прямо из редактора ExtendScript Toolkit
- сдвоенные символы принудительного разрыва строки (Shift+Enter) заменяются на один такой символ (ранне заменялись на знак абзаца)
- отмена всех операций одной командой
- скрипт в процессе работы не уничтожает содержимое буфера обмена
- можно выделять любые объекты содержащие текст: текстовые фреймы, таблицы, включая вложенные
- адаптированы шрифты для Mac

2012-06-06
*/

#target indesign
#targetengine "dotextok"

#include "Constants.incjsx"
#include "ProgressBar.incjsx"
#include "TxtProcessing.incjsx"

////
// блок ниже перемещен в файл WordsAndUnits.jsx, чтобы все пользовательские наработки не пропали с появлением новой версии скрипта.
/*
// SpaceLetterNonbreackingSpace - однобуквенные частицы, которые не будут оторваны от следующего слова
var SpaceLetterNonbreackingSpace = "(а|а,|в|и|и,|к|о|с|у|с\\.|т\\.|п\\.|ч\\.|\"О|\"К|В|И|К|О|С|У|А|\"У)"; 
// NonbreackingSpaceLetterSpace - однобуквенные частицы, которые не будут оторваны от предыдущего слова
var NonbreackingSpaceLetterSpace = "(б|ж)";
////
// SpaceTwoLetterNonbreackingSpace - двухбуквенные частицы, которые не будут оторваны от следующего слова
var SpaceTwoLetterNonbreackingSpace = "(не|ни|на|ну|ну,|от|об|из|за|да|да,|но|но,|по|до|во|со|ко|та|ту|то|те|см\\.|им\\.|Не|Ни|На|Ну|Ну,|От|Об|Из|За|Да|Да,|Но|Но,|По|До|Во|Со|Ко|Та|Ту|То|Те|См\\.|Им\\.|\"Об)";
// NonbreackingSpaceTwoLetterSpace - двухбуквенные частицы, которые не будут оторваны от предыдущего слова
var NonbreackingSpaceTwoLetterSpace = "(ли|же|ль|бы|бы,|же,)";
////
// привязываемые к числу единицы измерений и названия месяцев
myUnits = "(\\d)( )(руб|ц/га|г[ .,]|кг|мм|дм|см|м[ .,]|км|л[ .,]|В|А|Вт|W|°C|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря|квартал\.)";
/////
*/

myCurrentVersionData_xx_xx_xx = "19.05.12";
var myProgramTitulWholeText = " Подготовка текста к вёрстке " +"(версия " +myCurrentVersionData_xx_xx_xx +" )" ;
var myProgramTitulFragment = " Обработка фрагмента текста вёрстки  " +"(версия " +myCurrentVersionData_xx_xx_xx +" )";
var myProgramTitul = myProgramTitulWholeText;
var myCurrActionNumber = 0;
var myNumberOfActions = 0;
var myResetOrRename = 0;
var mySpecialName;
var myStartOfFragment;
var myEndOfFragment;
myDefSetName = "#DoTextOK.dtok"
var myFoundSamples;

// в этой переменной сохранены все пользовательские установки
var properties = {};

// myInfoColorSample — шаблон цвета для myInfoColor
var myInfoColorSample = [0, 100, 100, 0];


// шрифт диалогов
var dialogFont = "Macintosh" == File.fs ? "Lucida Grande" : "Verdana";

var myAllSpaces = ["Нет отбивки",
"Волосяная шпация",
"Обычный пробел",
"Фиксированный пробел",
"Неразрывный пробел",
"Шпация на 1/6 круглой",
"Тонкая шпация",
"Шпация на 1/4 круглой",
"Шпация на 1/3 круглой",
"Шпация на точку"];
//////////////////////////////////
var myAllSpacesValues = [myNoSpace,
myHairSpace,
mySpace,
myNonbreakingSpaceFixedWidth,
myNonbreakingSpace,
mySixSpace,
myThinSpace,
myQuarterSpace,
myThirdSpace,
myPunctuationSpace];
///////////////////////////
myJobCancelled = false;
myClean_value_start = true;
c_options_enabled_start = true;
//repSpace_value_start = true;
repChar_value_start = true;
tabs2spaces_value_start = false;
hyphens_value_start = true;
bull2text_value_start = true;
charStyles_value_start = true;
digAndChar_value_start = true;
oneStyle_value_start = false;
rusLang_value_start = true;
myTypographica_value_start = true;
t_options_enabled_start = true;////----
hyplinks_value_start = false;
fixOneLetter_value_start = true;
fixTwoLetter_value_start = false;
fixDigitAndWord_value_start = true;
commonTire_value_start = true;
minus_value_start = true;
myDotOrWithout_value_start = true;//---
mlnWithoutPoint_value_start = false;
myProcAndPromille_value_start = true;//---
slitno_value_start = true;
myFootnoteGroup_value_start = true;
footnote1_value_start = true;
mySpatium_value_start = true;
s_options_enabled_start = true;////----
tireAndSpatium_value_start = true;
mySpaceListBefore_selection_start = 4;
mySpaceListAfter_selection_start = 2;
commatire_value_start = true;
myCommaAndTire_selection_start = 0;
shortword_value_start = true;
myShortWordSpace_selection_start = 1;
initials_value_start = true;
myASPushkinFirstSpace_selection_start = 6;
myASPushkinSecondSpace_selection_start = 3;
myPushkinASFirstSpace_selection_start = 3;
myPushkinASSecondSpace_selection_start = 6;
myPhone_value_start = false;
p_options_enabled_start = true;
sevendigits_value_start = false;
sixdigits_value_start = false;
mySlider_value_start = 100;
mySet34_value_start = true;
mySet322_value_start = true;
SepIsSpace_value_start = false;
SepIsDefis_value_start = true;
SepIsMinus_value_start = false;
grekCharStyles_value_start = true;
mySelectedQuotes_value_start = 0;
setquotes_value_start = false;
myFootnoteGroup_value_start = true;
myOneLineIsOneAbzatz_start = false;
SearchedDefis_value_start = false;
SearchedMinus_value_start = true;
SearchedTire_value_start = false;
var mySpecialChar_start = '([α-ωäöüÄÖÜß¼½¾])';
///===
var myOneLineIsOneAbzatz_value;
var myClean_value;
var c_options_enabled;
//var repSpace_value;
var repChar_value;
var tabs2spaces_value;
var hyphens_value;
var bull2text_value;
var charStyles_value;
var digAndChar_value;
var oneStyle_value;
var rusLang_value;
var myTypographica_value;
var t_options_enabled;////----
var hyplinks_value;
var fixOneLetter_value;
var fixTwoLetter_value;
var fixDigitAndWord_value;
var commonTire_value;
var minus_value;
var myDotOrWithout_value;//---
var mlnWithoutPoint_value;
var myProcAndPromille_value;//---
var myFootnoteGroup_value;
var grekCharStyles_value;
var slitno_value;
var footnote1_value;
var mySpatium_value;
var s_options_enabled;////----
var tireAndSpatium_value;
var mySpaceListBefore_selection;
var mySpaceListAfter_selection;
var commatire_value;
var myCommaAndTire_selection;
var shortword_value;
var myShortWordSpace_selection;
var initials_value;
var myASPushkinFirstSpace_selection;
var myASPushkinSecondSpace_selection;
var myPushkinASFirstSpace_selection;
var myPushkinASSecondSpace_selection;
var myPhone_value;
var p_options_enabled;
var sevendigits_value;
var sixdigits_value;
var myPrevSelectedStyle;
var mySlider_value;
var mySet34_value;
var mySet322_value;
var SepIsSpace_value;
var SepIsDefis_value;
var SepIsMinus_value;
var SearchedDefis_value;
var SearchedMinus_value;
var SearchedTire_value;
var SepIsDot_value;
var myPrevSelectedStyle;
var mySelectedQuotes_value;
var setquotes_value;
var myStyledText = 0;
////===================
// Переменные, отражающие выбранные параметры работы скрипта
// если переменная равна 2, значит, этот параметр сейчас исключён из рассмотрения.
// 1 означает, что флажок установлен, 0 -- сброшен
var myCleanValueFromMenu;
var repCharFromMenu;
var tabs2spacesFromMenu;
var hyphensFromMenu;
var bull2textFromMenu;
var charStylesFromMenu;
var grekCharStylesFromMenu;
var digAndCharFromMenu;
var rusLangFromMenu;
var myTypographicaValueFromMenu;
var hyplinksFromMenu;
var fixOneLetterFromMenu;
var fixTwoLetterFromMenu;
var fixDigitAndWordFromMenu;
var commonTireFromMenu;
var minusFromMenu;
var mlnWithoutPointFromMenu;
var slitnoFromMenu;
var footnote1FromMenu;
var ParaIndexFromMenu;
var tireAndSpatiumFromMenu;
var mySpaceListBeforeFromMenu; // index
var mySpaceListAfterFromMenu;  // index
var commatireFromMenu;
var myCommaAndTireFromMenu;  // index
var shortwordFromMenu;
var myShortWordSpaceFromMenu; // index
var initialsFromMenu;
var myASPushkinFirstSpaceFromMenu; // index
var myASPushkinSecondSpaceFromMenu; // index
var myPushkinASFirstSpaceFromMenu;  // index
var myPushkinASSecondSpaceFromMenu;  // index
var mySelectedQuotesFromNenu; // index
var sevendigitsFromMenu;
var sixdigitsFromMenu;
var mySliderValueFromMenu;
var Set34FromMenu;
var SepIsSpaceFromMenu;
var setquotes_valueFromMenu;
var SepIsDefisFromMenu;
var SepIsMinusFromMenu;
var SepIsDotFromMenu;
var mySpatiumValueFromMenu;
var myPhoneValueFromMenu;
var myOneLineIsOneAbzatzFromMenu;
var SearchedDefisFromMenu;
var SearchedMinusFromMenu;
var SearchedTireFromMenu;
var myCurFileWordsAndUnits = "WordsAndUnits.jsx";
////======
////////////////////////////////////
// проверка версии InDesign
if (parseInt (app.version) < 6) { // app.version
	alert ("Запустите InDesign CS4+ для обработки текста этим скриптом.", myProgramTitul);
    exit();
} // app.version

if(app.documents.length == 0) { // app.documents.length != 0
	alert("Нет открытых документов.", myProgramTitul);	
	exit();
}

var mySelection = app.selection[0];
var myDocument = app.activeDocument;
// масиив объектов внутри которых обрабатывается текст
var processingObjects = [];

/// <<< на время отладки...
var myWordsAndUnitsiFile = myFile(myCurFileWordsAndUnits);
var myIniFile = new File (myWordsAndUnitsiFile);

if (myIniFile.exists) {
	// прочитаем значения переменных из файла WordsAndUnits
	try { 
		app.doScript(myIniFile);
	} catch (e) {
		alert('Синтаксическая ошибка в файле WordsAndUnits.jsx\n' + e.message);
		exit();
	}
} 
else {
	alert("Не найден файл WordsAndUnits.jsx. Он должен быть в \
том же каталоге, где размещен этот скрипт.");
	exit(); 
}   

if (app.selection.length == 0) {
	if (!confirm("Ничего не выделено. Обработать весь документ?")) {
		exit();
	}
	var selection = myDocument.stories;
}
else {
	var selection = app.selection;
}

// поиск подходящих объектов внутри выделения
(function seekStories(items) {
	for (var i = items.length; i--; ) {
		var item = items[i];
		//alert(item.constructor.name);
		
		// анализируем что же выделил пользователь?
		switch (item.constructor.name) {
			case 'InsertionPoint': // просто курсор внутри текста - не выделено ничего
				seekStories([item.parentStory]);
				break;
			
			// выделен фрагмент
			case 'TextFrame':
			case 'Character':
			case 'Line':
			case 'Text':
			case 'TextColumn':
			case 'TextStyleRange':
			case 'Word':
				// расширим выделенную область до кратности абзацам
				if (item.paragraphs.length > 0) {
					var myStartOfFragment = item.paragraphs.firstItem().characters.firstItem().index;
					var myEndOfFragment =   item.paragraphs.lastItem().characters.lastItem().index - 1;
					item = item.parentStory.characters.itemByRange(myStartOfFragment, myEndOfFragment);
				}
				// внимание! дальше выполняется следующий блок case
			
			case 'Paragraph':
			case 'Story':
				// пропустим пустые
				if (item.contents.length > 0) {
					processingObjects.push(item);
				}
				seekStories(item.tables);
				// добавим вложенные
				seekStories(item.textFrames);
				break;
			
			// таблица
			case 'Table':
				// в таблице обработаем каждую ячейку
				seekStories(item.cells);
				break;
				
			case 'Cell':
				// обработаем все объекты Text
				seekStories(item.texts);
				break;
		}
	}
})(selection);

// выход если ничего подходящего не выделено
if (0 == processingObjects.length) {
	alert("Перед запуском программы поставьте курсор в текст для подготовки всей статьи к верстке.\nВыделите часть текста для проверки только её.", myProgramTitul);	
	exit();
}

//~ // #DoTextOK.dtok - основной файл обработки текста
var mySetFile;
var myScriptFile = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptFile.path);
var myFilePath = decodeURI(myScriptFolder + "/ " + myDefSetName); //  myDefSetName = #DoTextOK.dtok
var mySetInfoFile = new File (myFilePath);
myScrFolder = new Folder (myScriptFile.path);
var myDoTextOKList = myScrFolder.getFiles("*.dtok");
if (myDoTextOKList.length == 0) { // первый запуск. нет ни одного файла настроек
        mySetFile = mySetInfoFile;
} //  первый запуск. нет ни одного файла настроек
if (myDoTextOKList.length == 1) { //  == 1 
    mySetFile = myDoTextOKList[0];
    } //  == 1
if (myDoTextOKList.length > 1) { // > 1
var mySetFile = File.openDialog(myProgramTitul, 'Файлы установок обработки текста скриптом DoTextOK: *.dtok');
if (mySetFile == null) { mySetFile = mySetInfoFile; }
} // > 1
var myArrForSplit = [];
myArrForSplit = decodeURI(mySetFile).split("/");
var myParaFileName = myArrForSplit[myArrForSplit.length-1];

if (mySetFile.exists) {
	ReadSettings(mySetFile);
}
else { // не найден файл с установками
	mySetDefaultValues();
}
/////////////////
// *** выбор параметров замены ***
var myCleanValue;
myClean_value == true ? myCleanValue = 1 : myCleanValue = 0;
var myTypoValue;
myTypographica_value == true ? myTypoValue = 1 : myTypoValue = 0;
var mySpatiumValue;
mySpatium_value == true ? mySpatiumValue = 1 : mySpatiumValue = 0;
var myPhoneValue;
myPhone_value == true ? myPhoneValue = 1 : myPhoneValue = 0;
var myWin = myScriptWindow();
if (myWin.show() == 2) exit(); // ==2  -- это щелчок на красном крестике в правом верхнем угле окна
//=================
function myScriptWindow() { // myScriptWindow
//var w = new Window ("dialog", "Подготовка текста к вёрстке" + "  [ " + myParaFileName + " ]", undefined); // 
var w = new Window ("dialog", "Подготовка текста к вёрстке" + "  [ " + myParaFileName + " ]", undefined, {closeButton: true});
//var w = new Window ("palette", "Подготовка текста к вёрстке", undefined); // 
w.alignChildren = "right";
var tpanel = w.add ("tabbedpanel");
tpanel.alignChildren = ["fill", "fill"];
tpanel.preferredSize = [350,250];
//===========================================
var clean = tpanel.add ("tab", undefined, "Чистка текста");
clean.alignChildren = "left";
var myClean = clean.add ("checkbox", undefined, "Выполнить выбранные операции");
myClean.value = properties.myCleanValueFromMenu;
var c_options = clean.add ("panel", undefined, "");
c_options.enabled = properties.myCleanValueFromMenu;
c_options.alignChildren = ["fill", "fill"];
infoAboutFootnotes = c_options.add ("checkbox", [0,0,585,20], "Убедитесь, что число сносок в файле такое же, как и в переданном на вёрстку тексте");
separator_f = c_options.add ("panel"); // Помещаем на экран горизонтальную линию.  Для программы этот параметр высота, но по сути это ширина линии
separator_f.minimumSize.height = separator_f.maximumSize.height = 1;
repChar = c_options.add ("checkbox", undefined, "Удалить повторяющиеся символы перевода строки");
repChar.value = 1 == properties.repCharFromMenu;
tabs2spaces = c_options.add ("checkbox", undefined, "Заменить символы табуляции на пробелы");
tabs2spaces.value = 1 == properties.tabs2spacesFromMenu;
hyphens = c_options.add ("checkbox", undefined, "Удалить в тексте символы переносов");
hyphens.value = 1 == properties.hyphensFromMenu;
digAndChar = c_options.add ("checkbox", undefined, "Привести в порядок наращение чисел (исправить '1-ых' на '1-х', '2-ого' на '2-го' и т.п.)");
digAndChar.value = properties.digAndCharFromMenu;
hyplinks = c_options.add ("checkbox", undefined, "Удалить гиперссылки из текста");
hyplinks.value = properties.hyplinksFromMenu;
setquotes = c_options.add ("checkbox", undefined, "Кавычки в тексте в соответствии с установками языка первого абзаца статьи");
setquotes.value = properties.setquotes_valueFromMenu;
myOneLineIsOneAbzatz = c_options.add ("checkbox", undefined, "Текст в формате 'одна строка - один абзац'");
myOneLineIsOneAbzatz_value == 1 ? myOneLineIsOneAbzatz.value = true : myOneLineIsOneAbzatz.value = false;
separator_c1 = c_options.add ("panel"); // Помещаем на экран горизонтальную линию Для программы этот параметр высота, но по сути это ширина линии
separator_c1.minimumSize.height = separator_c1.maximumSize.height = 1;
var myTireAndSeparatorGroup = c_options.add ("group");
myTireAndSeparatorGroup.orientation = "row";
myTireAndSeparatorGroup.alignChildren = "left";
var TireGroup = myTireAndSeparatorGroup.add ("group");
TireGroup.orientation = "column";
TireGroup.alignChildren = "left";
TireGroup.add ("statictext", undefined, "Тире в тексте");
var commonTire = TireGroup.add ("radiobutton", undefined, "Длинное тире");
commonTire.value = properties.commonTireFromMenu;
var shortTire = TireGroup.add ("radiobutton", undefined, "Короткое тире (минус)");
shortTire.value = !commonTire.value;
//---
var myEmptyGroup = myTireAndSeparatorGroup.add ("group");
myEmptyGroup.orientation = "column";
myEmptyGroup.alignChildren = "left";
myEmptyGroup.add ("statictext", [0,0,90,10], "");
//---
var mySeparatorGroup = myTireAndSeparatorGroup.add ("group");
mySeparatorGroup.orientation = "column";
mySeparatorGroup.alignChildren = "left";
mySeparatorGroup.add ("statictext", undefined, "Разделитель цифр в интервалах дат и чисел");
var myDigitAndYearDivisionRadioGroup = mySeparatorGroup.add ("group");
myDigitAndYearDivisionRadioGroup.orientation = "column";
myDigitAndYearDivisionRadioGroup.alignChildren = "left";
var minus = myDigitAndYearDivisionRadioGroup.add ("radiobutton", undefined, "Минус");
minus.value = properties.minusFromMenu;
var tire = myDigitAndYearDivisionRadioGroup.add ("radiobutton", undefined, "Тире");
tire.value = !minus.value;
separatorS = c_options.add ("panel"); // Помещаем на экран горизонтальную линию
separatorS.minimumSize.height = separatorS.maximumSize.height = 1;
var myMlnGroup = c_options.add ("group");
myMlnGroup.orientation = "row";
myMlnGroup.alignChildren = "left";
myMlnGroup.add ("statictext", undefined, "Вариант сокращения: с точкой или без точки");
myDotOrNot = myMlnGroup.add ("group");
myDotOrNot.orientation = "row";
myDotOrNot.alignChildren = "left";
var mlnWithoutPoint = myDotOrNot.add ("radiobutton", undefined, "млн, млрд, трлн");
var mlnWithPoint = myDotOrNot.add ("radiobutton", undefined, "млн., млрд., трлн.");
mlnWithoutPoint.value = properties.mlnWithoutPointFromMenu;
mlnWithPoint.value = !mlnWithoutPoint.value;
//=============================================
var typo = tpanel.add ("tab", undefined, "Оформление текста");
typo.alignChildren = "left";
var myTypographica = typo.add ("checkbox", undefined, "Выполнить выбранные операции");
myTypographica.value = properties.myTypographicaValueFromMenu;
var t_options = typo.add ("panel", undefined, "");
t_options.enabled = myTypographica.value;
t_options.alignChildren = ["fill", "fill"];
var myHypAndQuotesGroup = t_options.add ("group"); 
myHypAndQuotesGroup.alignChildren = ["fill", "fill"];
myHypAndQuotesGroup.orientation = "row";
fixOneLetter = t_options.add ("checkbox", undefined, "Запретить отрывать однобуквенные предлоги (частицы, союзы) от слов");
fixOneLetter.value = properties.fixOneLetterFromMenu;
fixTwoLetter = t_options.add ("checkbox", undefined, "Запретить отрывать двухбуквенные предлоги (частицы, союзы) от слов");
fixTwoLetter.value = properties.fixTwoLetterFromMenu;
fixDigitAndWord = t_options.add ("checkbox", undefined, "Неразрывный пробел между цифрой и названием месяца или единицей измерения");
bull2text = t_options.add ("checkbox", undefined, "Преобразовать буллиты и нумерацию в текст");
bull2text.value = properties.bull2textFromMenu;
fixDigitAndWord.value = properties.fixDigitAndWordFromMenu;
charStyles = t_options.add ("checkbox", undefined, "Создать символьные стили для курсива, полужирного, верхнего и нижнего индексов");
charStyles.value = properties.charStylesFromMenu;
grekCharStyles = t_options.add ("checkbox", undefined, "Создать символьный стиль для специальных знаков и букв других алфавитов");
grekCharStyles.value = properties.grekCharStylesFromMenu;
var mySpecCharLine = t_options.add ("edittext", undefined, mySpecialChar);
mySpecCharLine.characters = 30;
mySpecCharLine.active = false;
//---
separator4 = t_options.add ("panel"); // Помещаем на экран горизонтальную линию Для программы этот параметр высота, но по сути это ширина линии
separator4.minimumSize.height = separator4.maximumSize.height = 1;
//--- 
var myFootnoteProcessing = t_options.add ("group");   
myFootnoteProcessing.alignChildren = ["fill", "fill"];
myFootnoteProcessing.orientation = "column";
var myFootnoteGroup = myFootnoteProcessing.add ("checkbox",undefined, "Когда рядом запятая или точка и знак сноски — ");
myFootnoteGroup.value = properties.footnote1FromMenu < 2;
var footnoteselection  = myFootnoteProcessing.add ("group");
footnoteselection.orientation = "row";
var footnote1 = footnoteselection.add ("radiobutton", undefined, "...знак сноски перед знаком пунктуации");
var footnote2 = footnoteselection.add ("radiobutton", undefined, "...сначала точка или запятая, затем знак сноски");
footnote1.value = 1 == properties.footnote1FromMenu;
footnote2.value = !footnote1.value;
footnoteselection.enabled = myFootnoteGroup.value;
separator_t2 = t_options.add ("panel"); // Помещаем на экран горизонтальную линию
separator_t2.minimumSize.height = separator_t2.maximumSize.height = 1;
var myInfoAboutStyleGroup = t_options.add ("group");
myInfoAboutStyleGroup.alignChildren = "left";
myInfoAboutStyleGroup.orientation = "row";
var myParaStyleNames = new Array;
var myStyleNameLength = 0;
for (i=0; i< myDocument.paragraphStyles.length; i++) { 
    myParaStyleNames.push(myDocument.paragraphStyles.item(i).name) ;  // перечень всех стилей документа, включая неотображаемый в панели Paragraphs вариант сброса всех стилей myDocument.paragraphStyles.item(0).name =  [No Paragraph Style]
    if (myDocument.paragraphStyles.item(i).name.length > myStyleNameLength) myStyleNameLength = myDocument.paragraphStyles.item(i).name.length;
    }
var myStyleIndex;
for (j = 0; j < myParaStyleNames.length; j++) { // myParaStyleNames.length
    if ( myParaStyleNames[j] == myPrevSelectedStyle) break;
    } // myParaStyleNames.length
if (j < myParaStyleNames.length) myStyleIndex = j;
else myStyleIndex = 1; // единица -- это индекс стиля Basic Paragraph
var oneStyle = myInfoAboutStyleGroup.add ("checkbox", undefined, "Присвоить тексту один стиль:");
oneStyle.value = properties.oneStyleFromMenu;
var myList = myInfoAboutStyleGroup.add ("dropdownlist", [0,0,myStyleNameLength*7,25], myParaStyleNames, {multiselect: false}); 
myList.selection = properties.ParaIndexFromMenu; 
oneStyle.value == false ? myList.enabled = false : myList.enabled = true;
rusLang = t_options.add ("checkbox", undefined, "Присвоить тексту после обработки атрибут 'Русский язык'");
rusLang.value = properties.rusLangFromMenu;
//==============================================
var spatium = tpanel.add ("tab", undefined, "Шпации в тексте");
spatium.alignChildren = "left";
var mySpatium= spatium.add ("checkbox", undefined, "Выполнить выбранные операции");
mySpatium.value = properties.mySpatiumValueFromMenu;
var s_options = spatium.add ("panel", undefined, "");
s_options.enabled = properties.mySpatiumValueFromMenu;
s_options.alignChildren = ["fill", "fill"];
//---
var myTireGroup = s_options.add ("group");
myTireGroup.alignChildren = "left";
myTireGroup.orientation = "column";
var myTireAndSpatiumInfo = myTireGroup.add ("group");
myTireAndSpatiumInfo.alignChildren = "left";
myTireAndSpatiumInfo.orientation = "row";
var tireAndSpatium = myTireAndSpatiumInfo.add ("checkbox", undefined, "Шпации до и после тире:"); 
tireAndSpatium.value = properties.tireAndSpatiumFromMenu;
var myTireSpatiumGroup = myTireAndSpatiumInfo.add ("group");
myTireSpatiumGroup.orientation = "row";
var mySpaceListBefore = myTireSpatiumGroup.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
var s = myTireSpatiumGroup.add ("statictext", [0,0,10,20], "—");
var mySpaceListAfter = myTireSpatiumGroup.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
mySpaceListBefore.selection = properties.mySpaceListBeforeFromMenu;
mySpaceListAfter.selection = properties.mySpaceListAfterFromMenu;
var mySliderGroup = myTireGroup.add ("group");
mySliderGroup.alignChildren = "left";
mySliderGroup.orientation = "row";
mySliderGroup.add ("statictext", undefined, "Сжатие шпаций обрамляющих тире, от 0 до 100%");
var mySpaceProc = mySliderGroup.add ("edittext", [0,0,35,20], SliderStartValue);
mySpaceProc.enabled = false;
mySpaceProc.text = properties.mySliderValueFromMenu;
var s2 = mySliderGroup.add ("statictext", [0,0,5,20], "");
var slider = mySliderGroup.add("slider", [0,0,175,20], properties.mySliderValueFromMenu, 0,100);
slider.onChanging = function () {mySpaceProc.text = slider.value} 
//---
myTireSpatiumGroup.enabled = tireAndSpatium.value;
mySliderGroup.enabled = tireAndSpatium.value;
separatorL = s_options.add ("panel"); // Помещаем на экран горизонтальную линию
separatorL.minimumSize.height = separatorL.maximumSize.height = 1;
var myCommaAndTireGroup = s_options.add ("group");
myCommaAndTireGroup.alignChildren = ["fill", "fill"];
myCommaAndTireGroup.orientation = "column";
var myCommaAndTireGroup1 = myCommaAndTireGroup.add ("group");
myCommaAndTireGroup1.alignChildren = "left";
myCommaAndTireGroup1.orientation = "row";
var commatire = myCommaAndTireGroup1.add ("checkbox", undefined, "Между запятой, точкой, многоточием и тире:");
commatire.value = properties.commatireFromMenu;
var myCommaAndTire = myCommaAndTireGroup1.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
myCommaAndTire.selection = properties.myCommaAndTireFromMenu;
myCommaAndTire.enabled = properties.commatireFromMenu;
//---
var myCommaAndTireGroup2 = myCommaAndTireGroup.add ("group");
myCommaAndTireGroup2.orientation = "row";
myCommaAndTireGroup2.alignChildren = "left";
var shortword = myCommaAndTireGroup2.add ("checkbox", undefined, "В составных сокращениях (т.д., т.е., т.к., ...):");
shortword.value = properties.shortwordFromMenu;
var myShortWordSpace = myCommaAndTireGroup2.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
myShortWordSpace.selection = properties.myShortWordSpaceFromMenu;
var myShortWordSpaceIndex;
shortword.value == false ? myShortWordSpace.enabled = false : myShortWordSpace.enabled = true;
//---   
separator3 = s_options.add ("panel"); // Помещаем на экран горизонтальную линию
separator3.minimumSize.height = separator3.maximumSize.height = 1;
var myFIOGroup = s_options.add ("group");
myFIOGroup.alignChildren = ["fill", "fill"];
myFIOGroup.orientation = "column";
var initials= myFIOGroup.add ("checkbox", undefined, "Шпации в инициалах");
initials.value = properties.initialsFromMenu;
var myASPushkin = myFIOGroup.add ("group");
myASPushkin.orientation = "row";
myASPushkin.add ("statictext", undefined, "А.");
var myASPushkinFirstSpace = myASPushkin.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
myASPushkinFirstSpace.selection = properties.myASPushkinFirstSpaceFromMenu;
myASPushkin.add ("statictext", undefined, "C.");
var myASPushkinSecondSpace = myASPushkin.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
myASPushkinSecondSpace.selection = properties.myASPushkinSecondSpaceFromMenu;
myASPushkin.add ("statictext", undefined, " Пушкин");
var myPushkinAS = myFIOGroup.add ("group");
myPushkinAS.orientation = "row";
myPushkinAS.add ("statictext", undefined, "Пушкин");
var myPushkinASFirstSpace = myPushkinAS.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false});  
myPushkinASFirstSpace.selection = properties.myPushkinASFirstSpaceFromMenu;
myPushkinAS.add ("statictext", undefined, "А.");
var myPushkinASSecondSpace = myPushkinAS.add ("dropdownlist", undefined, myAllSpaces, {multiselect: false}); 
myPushkinASSecondSpace.selection = properties.myPushkinASSecondSpaceFromMenu;
myPushkinAS.add ("statictext", undefined, "С.");
myASPushkinFirstSpace.enabled = initials.value; 
myASPushkinSecondSpace.enabled = initials.value;
myPushkinASFirstSpace.enabled = initials.value;
myPushkinASSecondSpace.enabled = initials.value;
separator4 = s_options.add ("panel"); // Помещаем на экран горизонтальную линию
separator4.minimumSize.height = separator4.maximumSize.height = 1;
var myProcGroup = s_options.add ("group");
myProcGroup.orientation = "column";
myProcGroup.alignChildren = ["fill", "fill"];
var myProcAndPromille = myProcGroup.add ("checkbox", undefined, "Знаки процента и промилле —");
myProcAndPromille.value = properties.slitnoFromMenu < 2;
myProcRadioGroup = myProcGroup.add ("group");
myProcRadioGroup.orientation = "row";
myProcRadioGroup.alignChildren = ["fill", "fill"];
var slitno = myProcRadioGroup.add ("radiobutton", undefined, "…ставятся без отбивки от числа");
var plusotbivka = myProcRadioGroup.add ("radiobutton", undefined, "…отбиваются от числа тонкой шпацией");
slitno_value == 1 ? slitno.value = true : slitno.value = false;
plusotbivka.value = !slitno.value;
myProcAndPromille.value == false ? myProcRadioGroup.enabled = false : myProcRadioGroup.enabled = true;
//==========================
var phone = tpanel.add ("tab", undefined, "Обработка телефонных номеров");
phone.alignChildren = "left";
var myPhone = phone.add ("checkbox", undefined, "Выполнить выбранные операции");
myPhone.value = properties.myPhoneValueFromMenu;
var p_options = phone.add ("panel", undefined, "");
p_options.enabled = myPhone.value;
//p_options.alignChildren = "left";
p_options.alignChildren = ["fill", "fill"];
var sevendigitsSetGroup = p_options.add ("group");
sevendigitsSetGroup.alignChildren = "left";
sevendigitsSetGroup.orientation = "column";
sevendigits = sevendigitsSetGroup.add ("checkbox", [0,0,575,20], "Искать в тексте семизначные номера телефонов");
var sevendigitsFormatGroup = sevendigitsSetGroup.add ("group");
sevendigitsFormatGroup.alignChildren = "left";
sevendigitsFormatGroup.orientation = "column";
sevendigitsFormatGroup.add ("statictext", undefined, "Формат написания семизначных номеров");
var sevendigitsRadioGroup = sevendigitsFormatGroup.add ("group");
sevendigitsRadioGroup.alignChildren = "left";
sevendigitsRadioGroup.orientation = "row";
var mySet34 = sevendigitsRadioGroup.add ("checkbox", undefined, "XXX-XXXX");
mySet34_value == 1 ? mySet34.value = true : mySet34.value = false;
var mySet322 = sevendigitsRadioGroup.add ("checkbox", undefined, "XXX-XX-XX");
mySet322_value == 1 ? mySet322.value = true : mySet322.value = false;
sevendigitsFormatGroup.enabled = properties.sevendigitsFromMenu;
sevendigits.value = properties.sevendigitsFromMenu;
sixdigits = p_options.add ("checkbox", undefined, "Искать в тексте шестизначные номера телефонов (формат ХХ-ХХ-ХХ)");
sixdigits.value = properties.sixdigitsFromMenu;
///
var SearchedSeparator =  p_options.add ("group");
SearchedSeparator.alignChildren = "left";
SearchedSeparator.orientation = "row";
MesssageAboutSearchedNmbrs = SearchedSeparator.add ("statictext", undefined, "Разделитель групп цифр в обрабатываемых номерах:");
var SearchedDefis = SearchedSeparator.add ("radiobutton", undefined, "Дефис");
SearchedDefis_value == 1 ? SearchedDefis.value = true : SearchedDefis.value = false;
var SearchedMinus = SearchedSeparator.add ("radiobutton", undefined, "Минус");
SearchedMinus_value == 1 ? SearchedMinus.value = true : SearchedMinus.value = false;
var SearchedTire = SearchedSeparator.add ("radiobutton", undefined, "Тире");
SearchedTire_value == 1 ? SearchedTire.value = true : SearchedTire.value = false;
///
separatorP = p_options.add ("panel"); // Помещаем на экран горизонтальную линию
separatorP.minimumSize.height = separatorP.maximumSize.height = 1;
var NumberSeparator =  p_options.add ("group");
NumberSeparator.alignChildren = "left";
NumberSeparator.orientation = "row";
MesssageAboutSep = NumberSeparator.add ("statictext", undefined, "Разделитель групп цифр в обработанных номерах:");
var SepIsSpace = NumberSeparator.add ("radiobutton", undefined, "Пробел");
SepIsSpace_value == 1 ? SepIsSpace.value = true : SepIsSpace.value = false;
var SepIsDefis = NumberSeparator.add ("radiobutton", undefined, "Дефис");
SepIsDefis_value == 1 ? SepIsDefis.value = true : SepIsDefis.value = false;
var SepIsMinus = NumberSeparator.add ("radiobutton", undefined, "Минус");
SepIsMinus_value == 1 ? SepIsMinus.value = true : SepIsMinus.value = false;
var SepIsDot = NumberSeparator.add ("radiobutton", undefined, "Точка");
SepIsDot_value == 1 ? SepIsDot.value = true : SepIsDot.value = false;
//===============================================
var myAllButtonsAndCopyrightInfo = w.add ("panel");
var buttonsAndCopyright = myAllButtonsAndCopyrightInfo.add ("group");
buttonsAndCopyright.orientation = "row";
buttonsAndCopyright.alignChildren = ["fill", "fill"];
//var myOkAndCancelButtons = buttonsAndCopyright.add ("group",[0,0,225,30],"");
var myOkAndCancelButtons = buttonsAndCopyright.add ("group");
myOkAndCancelButtons.orientation = "column";
myOKButon = myOkAndCancelButtons.add ("button", [0,0,100,30], "Обработать", {name: "ok"});
myCancelButon = myOkAndCancelButtons.add ("button", [0,0,100,30], "В другой раз", {name: "cancel"});
var myCopyrightInfo = buttonsAndCopyright.add("group", [0,0,400,30] ); // {x:20, y:32, width:660, height:12}     [0,0,400,30]      {x:0, y:20, width:400, height:30}
//var myCopyrightInfo = buttonsAndCopyright.add("group");
myCopyrightInfo.orientation = "column";
//myCopyrightInfo.alignChildren = ["fill", "fill"];
myCopyrightInfo.alignChildren = "center";
var myMessage = myCopyrightInfo.add ("statictext");
var myMessage1 = myCopyrightInfo.add ("statictext");
var myMessage2 = myCopyrightInfo.add ("statictext");
myMessage.text = "";
myMessage1.text = "DoTextOK (" + myCurrentVersionData_xx_xx_xx + ") | © Михаил Иванюшин | adobeindesign.ru";
myMessage2.text = "";
myMessage.graphics.font = dialogFont + ":10";
myMessage.graphics.foregroundColor = myMessage.graphics.newPen (myMessage.graphics.PenType.SOLID_COLOR, [0, 0,1, 1], 1);
myMessage1.graphics.font = dialogFont + ":11";
myMessage1.graphics.foregroundColor = myMessage1.graphics.newPen (myMessage1.graphics.PenType.SOLID_COLOR, [0, 0,1, 1], 1);
myMessage2.graphics.font = dialogFont + ":10";
myMessage2.graphics.foregroundColor = myMessage1.graphics.newPen (myMessage1.graphics.PenType.SOLID_COLOR, [0, 0,1, 1], 1);
var myResAndSave = buttonsAndCopyright.add ("group"); 
myResAndSave.orientation = "column";
myReset = myResAndSave.add ("button", [0,0,100,30], "Сброс");
mySaveButon = myResAndSave.add ("button", [0,0,100,30], "Сохранить");
if (myCleanValue == 0)  { myClean.value = false; c_options.enabled = false;  myOKButtonState();}
if (myCleanValue == 1)  { myClean.value = true; c_options.enabled = true;  myOKButtonState();}
if (myTypoValue == 0)  { myTypographica.value = false; t_options.enabled = false;  myOKButtonState();}
if (myTypoValue == 1)  { myTypographica.value = true; t_options.enabled = true;  myOKButtonState();}
if (myPhoneValue == 0)  { myPhone.value = false; p_options.enabled = false;  myOKButtonState();}
if (myPhoneValue == 1)  { myPhone.value = true; p_options.enabled = true;   myOKButtonState();}
if (mySpatiumValue == 0)  { mySpatium.value = false; s_options.enabled = false;   myOKButtonState();}
if (mySpatiumValue == 1)  { mySpatium.value = true; s_options.enabled = true; myOKButtonState();}
///////////////////////////////////////////////////////
myClean.onClick = function () { // myClean.onClick
	c_options.enabled = myClean.value;
	myOKButtonState();
} // myClean.onClick
/////////////////////////////////////
oneStyle.onClick = function () { // oneStyle.onClick   
	myList.enabled = oneStyle.value;
} // oneStyle.onClick
////////////////////////////////////
hyplinks.onClick =        myOKButtonState;
setquotes.onClick =       myOKButtonState;
fixOneLetter.onClick =    myOKButtonState;
fixTwoLetter.onClick =    myOKButtonState;
fixDigitAndWord.onClick = myOKButtonState;
bull2text.onClick =       myOKButtonState;
charStyles.onClick =      myOKButtonState;
////////////////////////////////////
tireAndSpatium.onClick = function () { // tireAndSpatium.onClick    
	tireAndSpatium_value = tireAndSpatium.value ? 1 : 0; 
	myTireSpatiumGroup.enabled = tireAndSpatium.value;
	mySliderGroup.enabled = tireAndSpatium.value; 
	myOKButtonState();
} // tireAndSpatium.onClick
////////////////////////////////////
commatire.onClick = function () { // commatire.onClick    
	commatire_value = commatire.value ? 1 : 0; 
	myCommaAndTire.enabled = commatire.value;
	myOKButtonState();
} // commatire.onClick
///////////////////////////
myPhone.onClick = function () { // myPhone.onClick
	p_options.enabled = myPhone.value
	myOKButtonState();
} // myPhone.onClick
//////////////////////////
initials.onClick = function () { // initials.onClick    
    initials_value = initials.value ? 1 : 0; 
    myASPushkinFirstSpace.enabled = initials.value; 
    myASPushkinSecondSpace.enabled = initials.value;
    myPushkinASFirstSpace.enabled = initials.value;
    myPushkinASSecondSpace.enabled = initials.value;	
	myOKButtonState();
} // initials.onClick
////////////////////////////////////
shortword.onClick = function () { // shortword.onClick    
	shortword_value = shortword.value ? 1 : 0; 
	myShortWordSpace.enabled = shortword.value;
	myOKButtonState();
} // shortword.onClick
///////////////////////////////////
myProcAndPromille.onClick = function () { // myProcAndPromille.onClick    
	myProcAndPromille_value = myProcAndPromille.value ? 1 : 0; 
	myProcRadioGroup.enabled = myProcAndPromille.value;
	myOKButtonState();
} // myProcAndPromille.onClick
////////////////////////////////////
grekCharStyles.onClick = function () { // grekCharStyles.onClick
	grekCharStyles_value = grekCharStyles.value ? 1 : 0; 
	grekCharStyles.value = grekCharStyles.value;
	mySpecCharLine.enabled = grekCharStyles.value;
	myOKButtonState();
} // grekCharStyles.onClick
//////////////////////////////////
myFootnoteGroup.onClick = function () { // myFootnoteGroup.onClick    
	myFootnoteGroup_value = myFootnoteGroup.value ? 1 : 0; 
	footnoteselection.enabled = myFootnoteGroup.value;
	myOKButtonState();
} // myFootnoteGroup.onClick
///////////////////////////////////
myTypographica.onClick = function () { // myTypographica.onClick
	t_options.enabled = myTypographica.value;
	myOKButtonState();
} // myTypographica.onClick
////////////////////////////////////////////////////
mySpatium.onClick = function () { //mySpatium.onClick
	s_options.enabled = mySpatium.value;
	myOKButtonState();
} // mySpatium.onClick
////////////////////////////////////////////////////
w.addEventListener('mouseout', leaveTestPalette);
///-- http://forums.adobe.com/message/3462710#3462710
function leaveTestPalette(/*MouseEvent*/mev) {
	if( mev.target instanceof Window ) app.activate();
}
///
mySaveButon.onClick = function() { // mySaveButon.onClick
	UpdateProperties();
	var myDateF = new Date;
	var myDayF = myDateF.getDate();
	if (myDayF < 10) myDayF = "0" + myDayF;
	var myMonthF = myDateF.getMonth();
	myMonthF++; // январь имеет индекс 0
	if (myMonthF < 10) myMonthF = "0" + myMonthF;
	var myHourF = myDateF.getHours();
	if (myHourF < 10) myHourF = "0" + myHourF;
	var myMinuteF = myDateF.getMinutes();
	if (myMinuteF < 10) myMinuteF = "0" + myMinuteF;
	var mySecondeF = myDateF.getSeconds();
	if (mySecondeF < 10) mySecondeF = "0" + mySecondeF;
	///	
	mySpecialName = "DoTextOK" + "@" + myDayF + "." + myMonthF + 
		"-" + myHourF + "." + myMinuteF + "." + mySecondeF + ".dtok";
	var myNameTmp = prompt("Дайте этому файлу установок осмысленное имя.\n\
Сейчас имя указывает на дату и время нажатия\nна клавишу 'Сохранить'\n\
Для отказа от сохранения установок нажмите клавишу 'Cancel'.", 
		mySpecialName, myProgramTitulWholeText);
	if (myNameTmp == null || myNameTmp.length == 0) return;
	if (myNameTmp.indexOf('.dtok') == -1) myNameTmp += '.dtok';
	mySpecialName = myNameTmp;
	var myFilePathSave= decodeURI(myScriptFolder + "/" + mySpecialName);
	var mySetInfoFileSave = new File (myFilePathSave);
	SaveSettings(mySetInfoFileSave);
	//mySaveInfoFile(mySetInfoFileSave);
	myResetOrRename = 2; 
	alert ("Выбранные установки сохранены в файле\n" + 
		mySpecialName, myProgramTitulWholeText);
} // mySaveButon.onClick
///
myOKButon.onClick = function() { // myOKButon.onClick 
	mySaveInfoFile(mySetInfoFile);
	w.close();
} // myOKButon.onClick
////////////////
infoAboutFootnotes.onClick = function () { // infoAboutFootnotes.onClick
	if  (infoAboutFootnotes.value != false)  { // infoAboutFootnotes.value != false
		var myParent = mySelection.parent;
		
		if (myParent.constructor.name != "Story") {
			alert ("Должен быть выбран основной текст, а не сноска или содержимое таблиц (" + 
				myParent.constructor.name + ").", myProgramTitulWholeText);
			infoAboutFootnotes.value = false;
			return;
		}
		infoAboutFootnotes.value = true;
		var myFootnotesNumber = myParent.footnotes.length;  
		
		if  (myFootnotesNumber == 0) {
			alert ("\nВ тексте сносок нет.", myProgramTitulWholeText);
		}
		else {
			alert ("В тексте есть сноски, их число — " + myFootnotesNumber + 
				".\nПрежде чем приступать к работе с текстом, убедитесь,\n\
что в вёрстку попали все сноски из импортированного файла.", myProgramTitulWholeText);
		}
	} // infoAboutFootnotes.value != false
	else { // else
		infoAboutFootnotes.value = false;
		alert ("С момента последнего вывода информации о сносках в этом тексте \
их там не прибавилось! :-))", myProgramTitulWholeText);          
	} // else
} // infoAboutFootnotes.onClick
////////////////
sevendigits.onClick = function () { // sevendigits.onClick    
	sevendigits_value = sevendigits.value ? 1 : 0; 
	sevendigitsFormatGroup.enabled = sevendigits.value;
	NumberSeparator.enabled = !(!sevendigits.value && !sixdigits.value);
	SearchedSeparator.enabled = NumberSeparator.enabled; 
	myOKButtonState();
} // sevendigits.onClick 
///////////////
sixdigits.onClick = function () { // sevendigits.onClick 
	sixdigits_value = sixdigits.value ? 1 : 0;
	NumberSeparator.enabled = !(!sevendigits.value && !sixdigits.value);
	SearchedSeparator.enabled = NumberSeparator.enabled; 
	myOKButtonState();
} // sevendigits.onClick 
///////////////
myReset.onClick = function() { // myReset.onClick
	mySetDefaultValues();
	myResetSettings();
	myOKButtonState(); 
	myResetOrRename = 1;
	alert ("Установки программы сброшены", myProgramTitulWholeText);
} // myReset.onClick
////////////////////
function myOKButtonState() { // myOKButtonState     
var CTSP, p_opt, t_opt, s_opt, c_state, t_state, s_state, p_state, CTS, CTP, CPS, TSP;
if (sevendigits.value == false && sixdigits.value == false) p_opt = false; else p_opt = true;
if (myProcAndPromille.value == false && tireAndSpatium.value == false && commatire.value == false && shortword.value == false  && initials.value == false) s_opt = false; else s_opt = true;
if (fixOneLetter.value == false  && fixTwoLetter.value == false && fixDigitAndWord.value == false &&
myFootnoteGroup.value == false && bull2text.value == false && charStyles.value == false && grekCharStyles.value == false) t_opt = false; else t_opt = true;
c_state = !myClean.value; //  == true, если: 1) флажок "Выполнить выбранные операции" не установлен 2) флажок "Выполнить выбранные операции" установлен, но ни одна операцияя не выбрана 
t_state = (myTypographica.value == false) || (myTypographica.value == true && t_opt == false);
s_state = (mySpatium.value == false) || (mySpatium.value == true && s_opt == false);
p_state = myPhone.value == false || (myPhone.value == true && p_opt == false);
if ((c_state != true) || (s_state == !true) || (t_state == !true) || (p_state == !true) ||
(c_options.enabled == true) || (t_options.enabled == true &&  t_opt == true)  || (s_options.enabled == true  &&  s_opt == true)  || (p_options.enabled == true  &&  p_opt == true))
{ myOKButon.enabled = true; mySaveButon.enabled = true;} else { myOKButon.enabled = false; mySaveButon.enabled = false;} 
} // myOKButtonState
///////////////////
function myResetSettings() { // myResetSettings
myClean.value = myClean_value;
c_options.enabled = c_options_enabled;
repChar.value = repChar_value;
myOneLineIsOneAbzatz.value = myOneLineIsOneAbzatz_value;
tabs2spaces.value = tabs2spaces_value;
hyphens.value = hyphens_value;
bull2text.value =bull2text_value;
charStyles.value = charStyles_value ;
digAndChar.value = digAndChar_value;
oneStyle.value =  oneStyle_value;
oneStyle.value == false ? myList.enabled = false : myList.enabled = true;
rusLang.value =rusLang_value;
myTypographica.value =myTypographica_value;
t_options.enabled = t_options_enabled;
hyplinks.value = hyplinks_value;
fixOneLetter.value = fixOneLetter_value;
fixTwoLetter.value = fixTwoLetter_value;
fixDigitAndWord.value = fixDigitAndWord_value;
commonTire.value = commonTire_value;
minus.value = minus_value;
mlnWithoutPoint.value = mlnWithoutPoint_value;
mlnWithPoint.value = !mlnWithoutPoint.value;
myProcAndPromille.value = myProcAndPromille_value;
myProcRadioGroup.enabled = myProcAndPromille.value;
slitno.value = slitno_value;
myFootnoteGroup_value = myFootnoteGroup.value ? 1 : 0; 
footnoteselection.enabled = myFootnoteGroup.value ;
footnote1.value = footnote1_value;
mySpatium.value = mySpatium_value;
s_options.enabled = s_options_enabled;
tireAndSpatium.value = tireAndSpatium_value;
if (tireAndSpatium.value != true ) {
	tireAndSpatium_value = 0; 
    myTireSpatiumGroup.enabled = false;
    mySliderGroup.enabled = false; 
}
else {
	tireAndSpatium_value = 1; 
    myTireSpatiumGroup.enabled = true;
    mySliderGroup.enabled = true;
}  
mySpaceListBefore.selection = mySpaceListBefore_selection;
mySpaceListAfter.selection = mySpaceListAfter_selection;
slider.value = mySlider_value;
mySpaceProc.text = mySlider_value;
commatire.value = commatire_value;
commatire.value == false ? myCommaAndTire.enabled = false : myCommaAndTire.enabled = true;
grekCharStyles.value = grekCharStyles_value;
grekCharStyles.value == false ? mySpecCharLine.enabled = false : mySpecCharLine.enabled = true;
myCommaAndTire.selection = myCommaAndTire_selection;
shortword.value = shortword_value;
shortword.value == false ? myShortWordSpace.enabled = false : myShortWordSpace.enabled = true;
myShortWordSpace.selection = myShortWordSpace_selection;
initials.value = initials_value;
myASPushkinFirstSpace.selection = myASPushkinFirstSpace_selection;
myASPushkinSecondSpace.selection = myASPushkinSecondSpace_selection;
myPushkinASFirstSpace.selection = myPushkinASFirstSpace_selection;
myPushkinASSecondSpace.selection = myPushkinASSecondSpace_selection;
/*
p_options.enabled = p_options_enabled;
sevendigits.value = sevendigits_value;
sixdigits.value = sixdigits_value;
mySet34.value = mySet34_value;
mySet322.value = mySet322_value;
SepIsSpace.value = SepIsSpace_value;
SepIsDefis.value = SepIsDefis_value;
SepIsMinus.value = SepIsMinus_value;
*/
if (initials.value != true ) { 
    initials_value = 0; 
    myASPushkinFirstSpace.enabled = false; 
    myASPushkinSecondSpace.enabled = false;
    myPushkinASFirstSpace.enabled = false;
    myPushkinASSecondSpace.enabled = false;	
    } 
else {
    initials_value = 1; 
    myASPushkinFirstSpace.enabled = true; 
    myASPushkinSecondSpace.enabled = true;
    myPushkinASFirstSpace.enabled = true;
    myPushkinASSecondSpace.enabled = true;    
    }
setquotes.value = setquotes_value;
if  (myClean.value == true)  {
        c_options.enabled = true;
}
else {
         c_options.enabled = false;
 }
if  (myTypographica.value == true)  {
        t_options.enabled = true;
}
else {
        t_options.enabled = false;
}
if  (mySpatium.value == true)  {
        s_options.enabled = true;
}
else {
        s_options.enabled = false;
}
mySpecialChar = mySpecialChar_start;
mySpecCharLine.text = mySpecialChar_start;
} // myResetSettings
////////////////////
function myParamsForProcessing(myPanelState,myCheckBoxState) { // myParamsForProcessing
var myRezult;
if (myPanelState == true) {
    myCheckBoxState == true ? myRezult = 1 : myRezult = 0;
    myNumberOfActions++; 
    } 
else myRezult =2;
return myRezult;
} // myParamsForProcessing
//////////////
// считывает установленные пользователем опции в переменную properties
function UpdateProperties () { /
	properties.myCleanValueFromMenu =        myClean.value;
	properties.repCharFromMenu =             myParamsForProcessing(myClean.value, repChar.value);
	properties.tabs2spacesFromMenu =         myParamsForProcessing(myClean.value, tabs2spaces.value);
	properties.hyphensFromMenu =             myParamsForProcessing(myClean.value, hyphens.value); 
	properties.bull2textFromMenu =           myParamsForProcessing(myTypographica.value, bull2text.value);
	properties.charStylesFromMenu =          myParamsForProcessing(myTypographica.value, charStyles.value); 
	properties.digAndCharFromMenu =          myParamsForProcessing(myClean.value, digAndChar.value);
	properties.rusLangFromMenu =             myParamsForProcessing(myTypographica.value, rusLang.value);
	properties.myTypographicaValueFromMenu = myTypographica.value;
	properties.hyplinksFromMenu =            myParamsForProcessing(myClean.value, hyplinks.value);
	properties.fixOneLetterFromMenu =        myParamsForProcessing(myTypographica.value, fixOneLetter.value);
	properties.fixTwoLetterFromMenu =        myParamsForProcessing(myTypographica.value, fixTwoLetter.value);
	properties.fixDigitAndWordFromMenu =     myParamsForProcessing(myTypographica.value, fixDigitAndWord.value);
	properties.commonTireFromMenu =          myParamsForProcessing(myClean.value, commonTire.value);
	properties.minusFromMenu =               myParamsForProcessing(myClean.value, minus.value);
	properties.mlnWithoutPointFromMenu =     myParamsForProcessing(myClean.value, mlnWithoutPoint.value);
	properties.slitnoFromMenu =              myParamsForProcessing(myProcAndPromille.value, slitno.value);
	properties.footnote1FromMenu =           myParamsForProcessing(myFootnoteGroup.value, footnote1.value);
	properties.ParaIndexFromMenu =           myList.selection.index;
	properties.oneStyleFromMenu =            oneStyle.value;
	properties.mySpatiumValueFromMenu =      mySpatium.value;
	properties.tireAndSpatiumFromMenu =      myParamsForProcessing(mySpatium.value, tireAndSpatium.value);
	properties.mySpaceListBeforeFromMenu =   mySpaceListBefore.selection.index;
	properties.mySpaceListAfterFromMenu =    mySpaceListAfter.selection.index;
	properties.mySliderValueFromMenu =       slider.value;
	properties.commatireFromMenu =           myParamsForProcessing(mySpatium.value,commatire.value);
	properties.myCommaAndTireFromMenu =      myCommaAndTire.selection.index;
	properties.grekCharStylesFromMenu =      myParamsForProcessing(myTypographica.value, grekCharStyles.value); 
	properties.shortwordFromMenu =           myParamsForProcessing(mySpatium.value,shortword.value);
	properties.myShortWordSpaceFromMenu =    myShortWordSpace.selection.index;
	properties.initialsFromMenu =            myParamsForProcessing(mySpatium.value,initials.value);
	properties.myASPushkinFirstSpaceFromMenu = myASPushkinFirstSpace.selection.index;
	properties.myASPushkinSecondSpaceFromMenu = myASPushkinSecondSpace.selection.index;
	properties.myPushkinASFirstSpaceFromMenu = myPushkinASFirstSpace.selection.index;
	properties.myPushkinASSecondSpaceFromMenu = myPushkinASSecondSpace.selection.index;
	properties.setquotes_valueFromMenu = myParamsForProcessing(myClean.value, setquotes.value);
	
	
	
	mySpecialChar = mySpecCharLine.text;
	var myUnicodeInfo = [];
	var myLineLength = mySpecialChar.length;
	for (i = 0; i < myLineLength; i++) { //  i < myLineLength
		myUnicodeInfo[i] = mySpecialChar.charCodeAt(i);
		} //  i < myLineLength
	var myUnicodeLine = myUnicodeInfo.join(',');
	mySetInfoFile.writeln(myUnicodeLine);//41
	
	
	properties.myPhoneValueFromMenu = myPhone.value;
	properties.sevendigitsFromMenu = myParamsForProcessing(myPhone.value,sevendigits.value);
	properties.sixdigitsFromMenu = myParamsForProcessing(myPhone.value,sixdigits.value);

	mySet34.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//46
	properties.mySet34FromMenu = myParamsForProcessing(myPhone.value,mySet34.value);

	mySet322.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//47
	properties.mySet322FromMenu = myParamsForProcessing(myPhone.value,mySet322.value);

	SepIsSpace.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//48
	properties.SepIsSpaceFromMenu = myParamsForProcessing(myPhone.value,SepIsSpace.value);

	SepIsDefis.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//49
	properties.SepIsDefisFromMenu = myParamsForProcessing(myPhone.value,SepIsDefis.value);

	SepIsMinus.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//50
	properties.SepIsMinusFromMenu = myParamsForProcessing(myPhone.value,SepIsMinus.value);

	SepIsDot.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//51
	properties.SepIsDotFromMenu = myParamsForProcessing(myPhone.value,SepIsDot.value);

	myOneLineIsOneAbzatz.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//52
	myOneLineIsOneAbzatzFromMenu = myParamsForProcessing(myClean.value,myOneLineIsOneAbzatz.value);

	SearchedDefis.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//53
	properties.SearchedDefisFromMenu = myParamsForProcessing(myPhone.value,SearchedDefis.value);

	SearchedMinus.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//54
	properties.SearchedMinusFromMenu = myParamsForProcessing(myPhone.value,SearchedMinus.value);

	SearchedTire.value== true ? mySetInfoFile.writeln(1) : mySetInfoFile.writeln(0);//55
	properties.SearchedTireFromMenu = myParamsForProcessing(myPhone.value,SearchedTire.value);

	mySetInfoFile.close();
} // mySaveInfoFile
///////////////////
return w;
} // myScriptWindow
//////////////////*** выбор сделан ***////////////////////////////
//if (myJobCancelled == true) exit();
var myDate = new Date;
var myHour = myDate.getHours();
if (myHour < 10) myHour = "0" + myHour;
var myMinutes = myDate.getMinutes();
if (myMinutes < 10) myMinutes = "0" + myMinutes;
var mySecondes = myDate.getSeconds();

// добавим необходимые стили
addStyles();

/// вызываем функцию с возможностью отмены одной командой
app.doScript(
	D0TextOK,                     // The script to execute. Can accept: File, String or JavaScript Function.
	ScriptLanguage.JAVASCRIPT,    // The language of the script to execute.
	[],                           // An array of arguments passed to the function 
	UndoModes.FAST_ENTIRE_SCRIPT, // How to undo this script.
	'D0TextOK'                    // The name of the undo step for entire script undo mode. 
);

// отчет о продолжительности обработки
var myDate = new Date;
var myHourFinis = myDate.getHours();
var myMinutesFinis = myDate.getMinutes();
var mySecondesFinis = myDate.getSeconds();
var myMinutesOverflow = 0;
var mySecondesOverflow = 0;
myHourFinis = myHourFinis - myHour;
myMinutesFinis = myMinutesFinis - myMinutes;
mySecondesFinis = mySecondesFinis - mySecondes;
if (mySecondesFinis <0) { //SW
	myMinutesFinis--;	
	if (mySecondesFinis != 0) { mySecondesFinis = 60 + mySecondesFinis; }
} //SW
if (myMinutesFinis < 0)  { //DR
	myHourFinis--;
	if (myMinutesFinis != 0) { myMinutesFinis = 60 + myMinutesFinis; }
	} //DR
if (myHourFinis <10) myHourFinis = "0" + myHourFinis;
if (myMinutesFinis <10) myMinutesFinis = "0" + myMinutesFinis;
if (mySecondesFinis <10) mySecondesFinis = "0" + mySecondesFinis;

// окно отчета
var myWindow = new Window ("dialog", myProgramTitulWholeText, undefined,{closeButton: false}); 
var TimeProcessing = myWindow.add ("statictext");
TimeProcessing.text = "Время обработки [ч:м:с] " + myHourFinis +":" + myMinutesFinis + ":" + mySecondesFinis;
var mySampleInfo = myWindow.add ("statictext");
var myRealUsedSet;
if ( myResetOrRename == 1 ) myRealUsedSet = "Установки сброшены, использовался файл параметров " + myDefSetName;
else if ( myResetOrRename == 2 ) myRealUsedSet = "Обработка выполнена созданным сейчас шаблоном " + mySpecialName;
else myRealUsedSet = "файл параметров: " + myParaFileName;
mySampleInfo.text = myRealUsedSet;
var buttons = myWindow.add ("group");
buttons.orientation = "row";
var Info = buttons.add ("statictext");
Info.text = "DoTextOK (" + myCurrentVersionData_xx_xx_xx + ") | © Михаил Иванюшин | adobeindesign.ru";
myOKButon = buttons.add ("button", undefined, "OK", {name: "ok"});
Info.graphics.font = dialogFont + ":11";
Info.graphics.foregroundColor = Info.graphics.newPen (Info.graphics.PenType.SOLID_COLOR, [0, 0,1, 1], 1);
myWindow.show();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addStyles() {
	// добавим специальный цвет
	if (charStylesFromMenu == 1 || 
		grekCharStylesFromMenu == 1 ||
		footnote1FromMenu != 2) {
		
		addDocumentCollectionElement('colors',{
			name:       "myInfoColor", 
			model:      ColorModel.process, 
			space:      ColorSpace.CMYK, 
			colorValue: myInfoColorSample
		});
	}
	// добавим необходимые символьные стили
	if (charStylesFromMenu == 1) { 
		addDocumentCollectionElement("characterStyles", {
			name:      "mySupChars",
			position:  Position.SUPERSCRIPT,
			fontStyle: "Regular",
			fillColor: "myInfoColor"
		});
		addDocumentCollectionElement("characterStyles", {
			name:      "mySubChars",
			position:  Position.SUBSCRIPT,
			fontStyle: "Regular",
			fillColor: "myInfoColor"
		});
		addDocumentCollectionElement("characterStyles", {
			name:      "myBoldChars",
			fillColor: "myInfoColor"
		});
		addDocumentCollectionElement("characterStyles", {
			name:      "myItalicChars",
			fillColor: "myInfoColor"
		});
		addDocumentCollectionElement("characterStyles", {
			name:      "myBoldItalicChars",
			fillColor: "myInfoColor"
		});
	}
	if (grekCharStylesFromMenu == 1) { // специальные символы
		addDocumentCollectionElement("characterStyles", {
			name:      "mySpecialChars",
			fillColor: "myInfoColor"
		});
	}
	if (footnote1FromMenu != 2) { // сноски
		addDocumentCollectionElement("characterStyles", {
			name:      "myFootnotes",
			position:  Position.SUPERSCRIPT,
			fillColor: "myInfoColor"
		});
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function D0TextOK() {
	// замена всех найденных объектов
	for (var i = processingObjects.length; i--; ) {
		var mySelection = processingObjects[i];
		
		// создадим временный текстовый фрейм
		var myObject = app.activeDocument.textFrames.add();
		var myText = myObject.parentStory;
		mySelection.duplicate(LocationOptions.AFTER, myText);
		mySelection.remove();
		
		// информация о времени нужна для вывода ее в шапке прогресс-бара
		var pBar = new ProgressBar(myProgramTitul);
		pBar.reset(" Время начала обработки [ч:м] " + myHour + ":" + myMinutes, myNumberOfActions);
		myTxtProcessing(myText, properties, pBar); 
		pBar.close();
		
		// копируем обратно
		myText.duplicate(LocationOptions.AFTER, mySelection);
		myObject.remove(); // удален вспомогательный фрейм
	}
}

///////////////

// ищет в указанной коллекции элемент по имени
// если таго не находится создает его с указанными параметрами
function addDocumentCollectionElement(collectionName, elementParameters) {
	var collection = myDocument[collectionName];
	var element = collection.itemByName(elementParameters.name);
	
	// если такого элемента нет - добавим его
	if (!element.isValid) {
		element = collection.add(elementParameters.name);
		
		// копируем параметры
		for (var i in elementParameters) {
			// указанный шрифт может отсутствовать
			// или не содержать указанного начертания
			// тогда здесь произойдет исключение
			try { 
				 element[i] = elementParameters[i];
			} catch (e) {
				alert("Ошибка при добавлении " + 
					elementParameters.name + ": " + e.message);
			}
		}
	}
	return element;
}

///////
function myFile(myFileName) {
var myScriptFile = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptFile.path);
var myFilePath = decodeURI(myScriptFolder + "/" +myFileName);
return myFilePath;
} //myFile
//
function myGetScriptPath() {
	try{
		return app.activeScript;
	}
	catch(myError){
		return File(myError.fileName);
	}
} //myGetScriptPath()
//////
function mySetDefaultValues() { // mySetDefaultValues
myClean_value = myClean_value_start ;
c_options_enabled = c_options_enabled_start;
repChar_value = repChar_value_start;
tabs2spaces_value = tabs2spaces_value_start;
hyphens_value = hyphens_value_start;
bull2text_value = bull2text_value_start;
charStyles_value = charStyles_value_start;
digAndChar_value = digAndChar_value_start;
oneStyle_value = oneStyle_value_start;
rusLang_value = rusLang_value_start;
myTypographica_value = myTypographica_value_start;
t_options_enabled = t_options_enabled_start ;////----
hyplinks_value = hyplinks_value_start;
fixOneLetter_value = fixOneLetter_value_start;
fixTwoLetter_value = fixTwoLetter_value_start;
fixDigitAndWord_value = fixDigitAndWord_value_start;
commonTire_value = commonTire_value_start;
minus_value = minus_value_start;
mlnWithoutPoint_value = mlnWithoutPoint_value_start;
myProcAndPromille_value = myProcAndPromille_value_start;//---
slitno_value = slitno_value_start;
myFootnoteGroup_value = myFootnoteGroup_value_start; 
footnote1_value = footnote1_value_start;
mySpatium_value = mySpatium_value_start;
s_options_enabled = s_options_enabled_start;////----
tireAndSpatium_value = tireAndSpatium_value_start;
mySpaceListBefore_selection = mySpaceListBefore_selection_start;
mySpaceListAfter_selection = mySpaceListAfter_selection_start;
mySlider_value = mySlider_value_start;
commatire_value = commatire_value_start;
grekCharStyles_value = grekCharStyles_value_start;
myCommaAndTire_selection = myCommaAndTire_selection_start;
shortword_value = shortword_value_start;
myShortWordSpace_selection = myShortWordSpace_selection_start;
initials_value = initials_value_start;
myASPushkinFirstSpace_selection = myASPushkinFirstSpace_selection_start;
myASPushkinSecondSpace_selection = myASPushkinSecondSpace_selection_start;
myPushkinASFirstSpace_selection = myPushkinASFirstSpace_selection_start;
myPushkinASSecondSpace_selection = myPushkinASSecondSpace_selection_start;
setquotes_value = setquotes_value_start;
p_options_enabled = p_options_enabled_start;
sevendigits_value = sevendigits_value_start;
sixdigits_value = sixdigits_value_start;
mySet34_value = mySet34_value_start;
mySet322_value = mySet322_value_start;
SepIsSpace_value = SepIsSpace_value_start;
SepIsDefis_value = SepIsDefis_value_start;
SepIsMinus_value = SepIsMinus_value_start;
SearchedDefis_value = SearchedDefis_value_start;
SearchedTire_value = SearchedTire_value_start;
SearchedMinus_value = SearchedMinus_value_start;
myOneLineIsOneAbzatz_value = myOneLineIsOneAbzatz_start;
} // mySetDefaultValues
///////////

// читает файл настроек в старом формате
function readSettingsFromOldFormat(mySetFile) {
	mySetFile.open("r");
	mySetFile.encoding = 'utf8';
	
	myClean_value = mySetFile.readln();
	c_options_enabled = mySetFile.readln();
	repChar_value = mySetFile.readln();
	tabs2spaces_value = mySetFile.readln();
	hyphens_value = mySetFile.readln();
	bull2text_value = mySetFile.readln();
	charStyles_value = mySetFile.readln();
	digAndChar_value = mySetFile.readln();
	rusLang_value = mySetFile.readln();
	myTypographica_value = mySetFile.readln();
	t_options_enabled = mySetFile.readln();
	hyplinks_value = mySetFile.readln();
	fixOneLetter_value = mySetFile.readln();
	fixTwoLetter_value = mySetFile.readln();
	fixDigitAndWord_value = mySetFile.readln();
	commonTire_value = mySetFile.readln();
	minus_value = mySetFile.readln();
	mlnWithoutPoint_value = mySetFile.readln();
	myProcAndPromille_value = mySetFile.readln();
	slitno_value = mySetFile.readln();
	myFootnoteGroup_value = mySetFile.readln();
	footnote1_value = mySetFile.readln();
	myPrevSelectedStyle = mySetFile.readln();
	mySpatium_value = mySetFile.readln();
	s_options_enabled = mySetFile.readln();
	tireAndSpatium_value = mySetFile.readln();
	mySpaceListBefore_selection = mySetFile.readln();
	mySpaceListAfter_selection = mySetFile.readln();
	mySlider_value = mySetFile.readln();
	commatire_value = mySetFile.readln();
	myCommaAndTire_selection = mySetFile.readln();
	grekCharStyles_value = mySetFile.readln();
	shortword_value = mySetFile.readln();
	myShortWordSpace_selection = mySetFile.readln();
	initials_value = mySetFile.readln();
	myASPushkinFirstSpace_selection = mySetFile.readln();
	myASPushkinSecondSpace_selection = mySetFile.readln();
	myPushkinASFirstSpace_selection = mySetFile.readln();
	myPushkinASSecondSpace_selection = mySetFile.readln();
	setquotes_value = mySetFile.readln();
	var myUniLine = mySetFile.readln(); // считана строка в записи данных формате юникод. Значения разделены запятой
	// Теперь их надо из текстового вида перевести в знаковый и поместить в mySpecialChar 
	var myUniArr = [];
	myUniArr = myUniLine.split(',');
	var myNewCharLine = "";
	for (j = 0; j < myUniArr.length; j++) { ///
		myNewCharLine += String.fromCharCode(myUniArr[j]);
		 } ///
	mySpecialChar = myNewCharLine;
	myPhone_value = mySetFile.readln();
	p_options_value = mySetFile.readln();
	sevendigits_value = mySetFile.readln();
	sixdigits_value = mySetFile.readln();
	mySet34_value = mySetFile.readln();
	mySet322_value = mySetFile.readln();
	SepIsSpace_value = mySetFile.readln();
	SepIsDefis_value = mySetFile.readln();
	SepIsMinus_value = mySetFile.readln();
	SepIsDot_value = mySetFile.readln();
	myOneLineIsOneAbzatz_value = mySetFile.readln();
	SearchedDefis_value = mySetFile.readln();
	SearchedMinus_value = mySetFile.readln();
	SearchedTire_value = mySetFile.readln();
	
	mySetFile.close();
}

// читает указанный файл настроек
function ReadSettings(mySetFile) {
	mySetFile.encoding = 'utf8';
	
	if (!mySetFile.open('r')) {
		alert('Не удалось прочитать настройки');
		return;
	}	
	var data = mySetFile.read();
	mySetFile.close();
	
	// если старый формат 
	if ('(' != data.substr(0, 1)) {
		readSettingsFromOldFormat(mySetFile);
		return;
	}
	try { // читаем новый формат
		properties = eval(data);
	} catch (e) {
		alert('Файл настроек поврежден');
		return;
	}
}

// созраняет настройки в новом формате
function SaveSettings(mySetFile) {
	mySetFile.encoding = 'utf8';
	
	if (!mySetFile.open('w') || !mySetFile.write(properties.toSource())) {
		alert('При сохранении файла настроет произошла ошибка');
	}
	mySetFile.close();
}
