

var MyTable;
var RecDict={};

function getElement(rec_id) {
  return MyTable.data('dynatable').settings.dataset.originalRecords[rec_id];
}

function transformContent2(rec_id) {
  var elem = getElement(rec_id);
  var result = {}
  if (elem["del"]) {
    result["id"] = elem["id"]
    result["date"] = '<strike>'+elem["date"]+'</strike>'
    result["name"] = '<strike>'+elem["name"]+'</strike>'
    result["del"] = '<input id='+rec_id+' onclick="overRide(this)" type="checkbox" checked/>'
  } else {
    result["id"] = elem["id"]
    result["date"] = elem["date"]
    result["name"] = elem["name"]
    result["del"] = '<input id='+rec_id+' onclick="overRide(this)" type="checkbox"/>'
  }
  return result;
}

function overRide(elem) {
  var id = elem.id
  var val = elem.checked
  MyTable.data('dynatable').settings.dataset.originalRecords[id]["del"] = val;
  console.log(MyTable.data('dynatable').settings.dataset.originalRecords[id])
  MyTable.data('dynatable').dom.update();
}

function transformContent(rec_id , header , content) {
  if(header=="del") {
    if(content==true) return '<input id='+rec_id+' onclick="overRide(this)" type="checkbox" checked/>'
    if(content==false) return '<input id='+rec_id+' onclick="overRide(this)" type="checkbox"/>'
  } else return content;
}

//generic enough
function ulWriter(rowIndex, record, columns, cellWriter) {
  var tr = '';
  var cp_rec = {}
  if(!MyTable) {
    for(var i in record) {
      cp_rec[i] = transformContent(RecDict[record.id], i , record[i])
    }
  } else cp_rec = transformContent2(RecDict[record.id])
  // grab the record's attribute for each column
  for (var i = 0, len = columns.length; i < len; i++) {
    tr += cellWriter(columns[i], cp_rec);
  }
  return '<tr>' + tr + '</tr>';
}


$.ajax({
  url: '/static/dynatable/dynatableajax.json',
  success: function(data){
    console.log(data)
    for(var i in data.records) {
      var orig_id = parseInt(data.records[i].id)
      var arr_id = parseInt(i)
      RecDict[orig_id] = arr_id
      data.records[i]["del"] = false
      // console.log(data.records[i]["date"]+"  :  originalRecords["+arr_id+"] <- "+orig_id+" | "+data.records[i]["name"])
    }
    MyTable = $('#my-ajax-table').dynatable({
                dataset: {
                  records: data.records
                },
                features: {
                  sort: false //i need to fix the sorting function... it sucks
                },
                writers: {
                  _rowWriter: ulWriter
                  // _cellWriter: customCellWriter
                }
              });
    console.log(RecDict)
    // MyTable.data('dynatable').dom.update();
    // MyTable.data('dynatable').dom.update();
    // $.doTimeout( 1, function(){
    //   console.log("holaaaaaa")
    //   MyTable.data('dynatable').sorts.clear();
    //     MyTable.data('dynatable').process();
    //     MyTable.data('dynatable').process();
    //   // $.doTimeout( 2000, function(){
    //   //   console.log("mundo")
    //   //   MyTable.data('dynatable').process();
    //   //   MyTable.data('dynatable').process();
    //   // });
    // });
  }
});

