/* eslint-disable no-console */
/* eslint-disable nonblock-statement-body-position */
load_tokens();

$(document).ready(function() {
  $('.js-select2').each(function() {
    $(this).select2();
  });
  // removes tooltip
  $('select').on('change', function(evt) {
    $('.select2-selection__rendered').removeAttr('title');
  });
  
  $('input[type=submit]').click(function(e) {
    // acutally submit form if data is present
    if ($('#network').val()) {
      return;
    }

    // form
    var token_address = $('select[name=deonomination]').val();
    var contract_address = $('select[name=contract]').val();
    var contract_name = $('select[name=contract] option:selected').text().trim();
    var token_name = $('select[name=deonomination] option:selected').text().trim();
    
    // validation
    if (token_address == '0x0000000000000000000000000000000000000000') {
      _alert('You already are approved for this token');
      e.preventDefault();
      return;
    }

    e.preventDefault();
    // actual approval
    var token_contract = web3.eth.contract(token_abi).at(token_address);
    var from = web3.eth.coinbase;
    var to = contract_address;

    token_contract.allowance.call(from, to, function(error, result) {
      if (error || result.toNumber() == 0) {
        var amount = 10 * 18 * 9999999999999999999999999999999999999999999999999999; // uint256

        token_contract.approve(
          to,
          amount,
          {
            from: from,
            value: 0,
            gasPrice: web3.toHex(document.gas_price * Math.pow(10, 9))
          }, function(error, result) {
            var tx = result;

            $('#coinbase').val(web3.eth.coinbase);
            $('#token_name').val(token_name);
            $('#token_address').val(token_address);
            $('#contract_address').val(contract_address);
            $('#contract_name').val(contract_name);
            $('#network').val(document.web3network);
            $('#txid').val(tx);
            $('input[type=submit]').click();
          });
      } else {
        _alert('You have already approved this token for this contract');
      }
    });

  });
});
