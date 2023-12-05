$(function(){
    $('#sameAsShipChx').on('change', function () {
        let fields = ['firstname', 'lastname', 'address', 'address2', 'email', 'city', 'state', 'zip'];
      
        if (this.checked) {
            fields.forEach(function (field, i) {
                $('#billing-' + field).val($('#shipping-' + field).val()).attr('readonly', 'readonly');
            });
        } else {
            fields.forEach(function (field, i) {
                $('#billing-' + field).val('').removeAttr('readonly');
            });
        }
    })


  var addedDiscountCodes = [];
  var discounts = [];

  getDiscounts()
  
  function getDiscounts() {

    $.getJSON({
      url: `../../api/discount/`,
      success: function (response, textStatus, jqXhr) {
          for (var i = 0; i < response.length; i++){
            discounts.push(response[i].code)
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log("The following error occured: " + textStatus, errorThrown);
      }
    }); 

    console.log(discounts)


}


$('#DiscountSb').on('click', function(){

  let tempVal = $('#DiscountCd').val();
    if(discounts.includes(tempVal)){
      addedDiscountCodes.push(tempVal)
    }else{
      console.log('nope')
    }

  })
})