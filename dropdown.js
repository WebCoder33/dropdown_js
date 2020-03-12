/** Example
 * 
 * <div>
 *  <input id=''youId' ... >
 * </div>
 * 
 *  name: dropDownCounter v1.0; email: coder33@yandex.ru
    let variable = new dropDownCounter({
            elem: document.getElementById('youId'),
            items: ['YouItems', ... ],
            itemsLineHeight: '6px',
            buttons: true/false,
            singleMode: true/false
        });
*/
'use strict'


function dropDownCounter(options) {

    let elem = options.elem;
    let items = options.items;
    let valBox = {
            startValue: 0,
            elemStyle: getComputedStyle(elem),
            elemHeader: elem.value.split(' ').slice(1).join(' '),
            inputValue: elem.value,
            items: {},
            dropDownshowed: false,
            zeroMode: true,
            buttons: options.buttons,
            singleMode: options.singleMode
        };   


    //Create dropDown and append to elem ======
    elem.parentNode.appendChild(createDropDown(elem));


    //Event listener on elem.parentNode ====================
    elem.parentNode.onclick = function(event) {

        let dropDown = elem.parentNode.querySelector('#'+elem.id+'_dropDown');
        let target = event.target;

        switch(target.id) {

            case elem.id: 
                showDropDown(dropDown);
                break;

            case 'up': 
            case 'down': 
                chengeValue(target);
                break;

            case 'cleanButton':
                resetValues(dropDown);
                break;

            case 'agreeButton':
                //create here your function for this data processing
                showDropDown(dropDown);
                break;

        }
  
        render(dropDown);
       
    }//============================================================

    //Rendering elements dropDown ====================================
    function render(element) {
    
        if (!element) return;

        //Rendering button down. Gray at 0. =====================
        valBox.amountItems = 0;
        valBox.zeroMode = true;

        for (let key in valBox.items ) {
            
            let item = element.querySelector('#'+key);
            let value = Number(item.querySelector('#value').innerHTML);
            let down = item.querySelector('#down');

            if ( Number(value) == 0 ) {
                down.style.borderColor = down.style.color = 'rgba(31, 32, 65, 0.25)';
            } else {
                down.style.borderColor = down.style.color = 'rgba(31, 32, 65, 0.5)';
                valBox.zeroMode = false;
            }

            valBox.amountItems += value;

        }
        //============================================================


        //Rendering input header =============================
        if (valBox.zeroMode || !valBox.dropDownshowed) { 
            if (valBox.amountItems == 0) elem.value = valBox.inputValue;
        } else {
            if (valBox.singleMode) {
                elem.value = valBox.amountItems + ' ' + valBox.elemHeader;
            } else {
                let value = '';
                let items = valBox.items;

                for (let key in items) {
                    let itemName = element.querySelector('#'+key ).firstChild.textContent;
                    let itemValue = items[key];

                    if (itemValue == 0) continue;
                    value += itemValue + ' ' + itemName + ', ';
                }
                elem.value = value.toLowerCase().slice(0,-2);
            }
        }
        //=============================================================
        
        //Rendering clear button. Hide at 0. =================
        if (!valBox.buttons) return;

        let cleanButton = element.querySelector('#cleanButton');
        
        if (valBox.zeroMode || !valBox.dropDownshowed) { 
            cleanButton.style.visibility = 'hidden';
        } else {
            cleanButton.style.visibility = 'visible';
        }
        //==============================================================


    }//=============================================================

    //Reset all values =============================================
    function resetValues(element) {

        for (let key in valBox.items) {
            
            let item = element.querySelector('#'+key);
            let value = item.querySelector('#value');
            
            value.innerHTML = valBox.items[key] = 0;

        }

    }//============================================================

    //Chenge values when click up or down ===========================
    function chengeValue(target) {
    
        let item = target.parentNode.parentNode.id;
        let value = target.parentNode.querySelector('#value');


        switch (target.id) {
        
            case 'up':
                valBox.items[item] += 1;
                console.log(valBox.items[item])
                value.innerHTML = valBox.items[item];
                break;

            case 'down':
                valBox.items[item] -= 1;
                if ( valBox.items[item] < 0 ) valBox.items[item] = 0;
                value.innerHTML = valBox.items[item];   
                break;
        }

    }//=============================================================

    //Show/Hide dropDown =========================================================
    function showDropDown(element) {

        //Get coords and push DropDown ==================
        let elemCoords = elem.getBoundingClientRect();

        element.style.left = elemCoords.left + 'px';
        element.style.top = elemCoords.bottom + elem.clientTop - 1 + 'px';
        //==================================================================

        //dropDown hiding. get status.
        if (valBox.dropDownshowed) {
            element.style.visibility = 'hidden';
            valBox.dropDownshowed = false;
        } else {
            element.style.visibility = 'visible';
            valBox.dropDownshowed = true;
        }//==================================================================

    }//=====================================================================    

    //Drop down constructor -> getDropDown(element);================================
    function createDropDown(element) {

        let dropDown = document.createElement('div');

        appendItems(dropDown);
        if (valBox.buttons) appendButtons(dropDown);
        setStyle(element, dropDown);
        dropDown.id = element.id + '_dropDown';
        
        render(dropDown);
        return dropDown;


    }

        //append items in element ====================
        function appendItems(element) {

            let itemElem = {};

            for (let key in items) {
                
                itemElem[key] = document.createElement('div');
                {//Set Style======================================
                    itemElem[key].innerHTML = items[key];
                    itemElem[key].style.cssText = 'display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center;'
                    itemElem[key].style.marginBottom = options.itemsLineHeight;
                    itemElem[key].style.fontFamily = element.fontFamily;
                    itemElem[key].style.fontSize = element.fontSize; 
                }//================================================
                
                let itemsKey = items[key].split(' ').slice(0).join('')
                itemElem[key].id = itemsKey;
                valBox.items[itemsKey] = 0;
                
                appendCounter(itemElem[key]);
                element.appendChild(itemElem[key]); 
            }
        }

        //append counter in element ===========================
        function appendCounter(element) {
            
            let wrap = document.createElement('div');
            let up = document.createElement('div');
            let down = document.createElement('div');
            let value = document.createElement('span');

            up.innerHTML = '+';
            value.innerHTML = valBox.startValue;
            down.innerHTML = '-';

            wrap.style.cssText = 'display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; width: 92px;'
            up.style.cssText = down.style.cssText = 'border: 1px solid rgba(31, 32, 65, 0.5); border-radius: 50px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(31, 32, 65, 0.5);';

            up.id = 'up';
            value.id = 'value';
            down.id = 'down';

            wrap.appendChild(down);
            wrap.appendChild(value);
            wrap.appendChild(up);
            
            element.appendChild(wrap);

        }

        //append buttons clean and agree in element ==================
        function appendButtons(element) {

            let wrap = document.createElement('div');
            let agree = document.createElement('span');
            let clean = document.createElement('span');

            let wrap_fontSize = Number(valBox.elemStyle.fontSize.slice(0, -2)) + 2;
            wrap.style.cssText = 'display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; margin-top: 16px; cursor: pointer;';
            wrap.style.fontFamily = elem.style.fontFamily;
            wrap.style.fontSize = wrap_fontSize + 'px';
            agree.style.color = '#BC9CFF';
            clean.style.color = 'rgba(31, 32, 65, 0.5)';

            clean.id = 'cleanButton';
            agree.id = 'agreeButton';

            agree.innerHTML = 'применить';
            clean.innerHTML = 'очистить';

            wrap.appendChild(clean);
            wrap.appendChild(agree);

            element.appendChild(wrap);

        }

    //Get style for dropDown =======================
    function setStyle(fromElem, toElem) {
        
            let elemStyle = getComputedStyle(fromElem);
            let elemBorder = elemStyle.borderBottomLeftRadius + ' ' + elemStyle.borderBottomRightRadius + ' ' + elemStyle.borderTopLeftRadius + ' ' + elemStyle.borderTopRightRadius;

            toElem.style.cssText = 'display: flex; flex-flow: column nowrap; justify-content: space-around; align-items: stretch; padding: 8px; box-shadow: 0px 10px 20px rgba(31, 32, 65, 0.05); font-weight: bold; position: fixed; background: #FFFFFF; z-index:99999;';
            toElem.style.width = fromElem.offsetWidth + 'px';
            toElem.style.border = elemStyle.border;
            toElem.style.borderTop = 'none';
            toElem.style.boxSizing = elemStyle.boxSizing;
            toElem.style.borderRadius = elemBorder;
            toElem.style.fontFamily = elemStyle.fontFamily;
            toElem.style.fontSize = elemStyle.fontSize;
            toElem.style.visibility = 'hidden';

    }
    //=======================================================================

}