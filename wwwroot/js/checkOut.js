$(function(){

    $('#totalCheckOut').html((parseInt($('#total_cart_value').html()) + 25.50))

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
  var addedDiscountFull = [];
  var discounts = [];

  getDiscounts()
  
  function getDiscounts() {

    $.getJSON({
      url: `../../api/discount/`,
      success: function (response, textStatus, jqXhr) {
          for (var i = 0; i < response.length; i++){
            discounts.push(response[i])
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


  if(!addedDiscountCodes.includes($('#DiscountCd').val())){

    for(var i = 0; i < discounts.length; i++){
      if($('#DiscountCd').val() == discounts[i].code){
        addedDiscountCodes.push($('#DiscountCd').val());
        addedDiscountFull.push(discounts[i]);
        alert('discount ' + discounts[i].title + ' added for ' + (discounts[i].discountPercent * 100) + '%');
        $('#discontsAdded').append('<br>' + discounts[i].product.productName + ': ' + (discounts[i].discountPercent * 100) + '%');
        $('#DiscountCd').val('');
        break;
      }else{
        console.log('nope');
      }
    }

  } else {
    alert('Discount already added')
  }

 console.log(addedDiscountFull)

  })

  var cartItems = [];
  var customerId = [];


 


  $(document).on('change', function(){

    

    $('.indProdTotal').each(function( index ){
      console.log($( this ).html())
    })

    $('#totalCheckOut').html((parseInt($('#total_cart_value').html()) + 25.50))

  });
})