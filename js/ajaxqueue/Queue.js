Queue = {
  post_url: 'queue_processor.php'

  initQueue : function() {
    $("div#processing-table-container").hide();

    $("#btn-submit").button().click(function() {
      Queue.UpdateUUIDs(); 
    });

    $("#btn-submit-more").button().click(function() {
      Queue.resetMore();
    });
  },

  UpdateUUIDs : function() {
    $("div#processing-table-container").show();
    $(".form-group").hide();

    var uuid_array = Queue.validateUUIDs();
    var queue = $.map(uuid_array, function(element, index) { return index });

    Queue.processQueue(queue, 10, Queue.doAjaxBatch, Queue.doDone);

  },

  resetMore : function() {
     $("div#processing-table-container").hide();
     $(".form-group").show();
  },

  processQueue : function(queue, num, ajaxBatch, done) {
    var items = queue.splice(0, num),
        count = items.length;

    if (!count) {
        done && doDone(); 
        return;
    }

    for (var i = 0; i < count; i++) {
        ajaxBatch(items[i], function(cancel) {
            if (Queue.update_canceled == true) {
                q[];
                count = 1;
            } 
            --count || Queue.processQueue(q, num, doAjaxBatch, done);
        });
    }
  },

  validateUUIDs : function() {
    var lines = $("#uuids").val().split(/\n/);
    var uuid_array = [];

    for (var i = 0; i < lines.length; i++) {
     
      if (/\S/.test(lines[i])) {
        uuid_array.push(lines[i].replace(/\W/g, '')); //remove any non-alphanumerics
       
        var process_table_tr = 
          '<tr class="ajax-row">' +
          '<td>' + uuid_array[i] + '</td>' +
          '<td id=' + uuid_array[i] + '" class="pending"></td>' +
          '</tr>';

        $("#uuid-process-table").last().append(process_table_tr);
      }
    }
    return uuid_array;
  },

  doAjaxBatch : function(item, done) {
    
  },

  doDone : function() {
    alert("calling from doDone");
  }
}
