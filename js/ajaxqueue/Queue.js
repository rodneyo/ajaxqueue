Queue = {
  post_url: 'queue_processor.php',

  initQueue : function() {
    $("div#processing-table-container").hide();

    $("#btn-submit").button().click(function() {
      Queue.updateUUIDs(); 
    });

    $("#btn-submit-more").button().click(function() {
      Queue.resetMore();
    });
  },

  updateUUIDs : function() {
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
                q = [];
                count = 1;
            } 
            --count || Queue.processQueue(q, num, doAjaxBatch, done);
        });
    }
  },

  showStatus : function(uuid, status_class) {
    var uuid_htmlid = '#' + uuid;
    $(uuid_htmlid).attr('class', status_class + 'bold');

    switch (status_class) {
        case "update":

            $(uuid_htmlid).text("Updating");
            $(uuid_htmlid).last().append(Qeuue.loader_img);
            break;

        case "success":

            $(uuid_htmlid).text("Success");
            $(uuid_htmlid).find('img').remove();
            break;

        case "failure":

            $(uuid_htmlid).text("Failed");
            $(uuid_htmlid).find('img').remove();
            break;

        case "cancel":

            $(uuid_htmlid).text("Canceled");
            $(uuid_htmlid).find('img').remove();
            break;
    } 
  },

  /**
   * Validate UUIDs
   *
   **/
  validateUUIDs : function() {
    var lines = $("#uuids").val().split(/\n/);
    var uuid_array = [];

    for (var i = 0; i < lines.length; i++) {
     
      if (/\S/.test(lines[i])) {
        uuid_array.push(lines[i].replace(/\W/g, '')); //remove any non-alphanumerics
       
        //Put all submitted UUIDs in a "Pending" status
        var process_table_tr = 
          '<tr class="ajax-row">' +
          '<td>' + uuid_array[i] + '</td>' +
          '<td id=' + uuid_array[i].substring(1,6) + '" class="pending">Pending</td>' +
          '</tr>';

        $("#uuid-process-table").last().append(process_table_tr);
      }
    }
    return uuid_array;
  },

  doAjaxBatch : function(item, done) {

   Queue.showStatus(uuid_array[item].substring(1,6), 'reset') 
  },

  doDone : function() {
    alert("calling from doDone");
  }
}
