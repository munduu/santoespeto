/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  Entrar */
    $(document).on("click", ".uib_w_5", function(evt)
    {
        
        var usuario = $("#usuario").val();
        var senha = $("#senha").val();
        //alert ('aqui');
        if(usuario==''){
            alert('usuario vazio');
        }
        if(senha==''){
            alert('senha vazia');
        }
        
        $.ajax({
        type:"POST",
        dataType:"json",
        url:"http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/login.php",
        data:{usuario: usuario, senha: senha},
        timeout: 2000,
            success:function(resultado){
                if(resultado.nomeu==''){
                    alert('NÃO DEU!');
                }else{
                    //alert('Deu!');
                    activate_page("#mesa");
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario');
            }
        });
        
         return false;
    });
     
    $(document).on("click", ".uib_w_9", function(evt)
    {
        
        var n_cartao = $("#n_cartao").val();
        var n_mesa   = $("#n_mesa").val();
        
        if(n_cartao==''){
            alert('n_cartao vazio');
        }
        if(n_mesa==''){
            n_mesa = 0;
        }
        
        /*$.ajax({
        type:"POST",
        dataType:"json",
        url:"http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/cartao.php",
        data:{n_cartao: n_cartao},
        timeout: 2000,
            success:function(resultado){
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else if(resultado.caminho == '2'){
                    //alert('Deu!');
                    activate_page("#cadastro_venda");
                }
                alert(resultado.caminho);
            },
            error:function(resultado){
                alert('Erro no nome do usuario');
            }
        });*/
        
        $.ajax({
        type:"POST",
        url:"http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/listar_venda.php",
        data:{n_cartao: n_cartao, n_mesa: n_mesa},
        timeout: 2000,
            success:function(resultado){
                $("#produto").val('');
                $("#sabor").hide();
                $("#sabor2").hide();
                $("#fracao").hide();
                $("#rem").hide();
                $("#add").hide();
                $("#nome_p").hide();
                 $(".uib_w_20").html(resultado);
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    activate_page("#cadastro_venda");
                    $(".n_mesa").val(n_mesa);
                    //alert(n_mesa);
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario');
            }
        });
        $.ajax({
        type:"POST",
        url:"http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/destaque.php",
        data:{n_cartao: n_cartao, n_mesa: n_mesa},
        timeout: 2000,
            success:function(resultado){
                 $(".uib_w_31").html(resultado);
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    activate_page("#cadastro_venda");
                    $(".n_mesa").val(n_mesa);
                    //alert('aqui');
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario');
            }
        });
        
    });        
    
     //BUSCA PRODUTO INICIO
     /*$(document).ready(function() {
         $('input.typeahead-devs').typeahead({
            name: 'produto',
            remote : 'http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/produto_busca.php?query=%QUERY'
         });
     })*/
     //BUSCA PRODUTO FIM
    $("#produto").blur(function(){ 
        
        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/nome_produto.php", {produto:$(this).val(), tipo:2}, function(valor){
          var nome_p 	= valor;
		  var prod   	= $("#produto").val();        
		        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/nome_produto.php", {produto:prod, tipo:1}, function(valorf){
                $("#nome_p").css("display", "");
				$("#nome_p").html(valorf);
				$('#incluir_produto').css("display", "");
				$('#incluir_produto').removeAttr('disabled');
				$('#bloco_produto').css("background-color","blue");
                  
              })
        });
        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/remocao.php", {produto:$(this).val(), tipo:2}, function(valor){ 
          var rem 	= valor;
		  var prod   	= $("#produto").val();        
            
		  if(rem>0){
		      $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/remocao.php", {produto:prod, tipo:1}, function(valorf){
                $("#rem").css("display", "");
				$("#rem").html(valorf);
				$('#incluir_produto').css("display", "");
				$('#incluir_produto').removeAttr('disabled');
				$('#bloco_produto').css("background-color","blue");
                  
              })
          } else{
              $("#rem").hide();
		      $('#incluir_produto').css("display", "");
              $('#incluir_produto').removeAttr('disabled');
		      $('#bloco_produto').css("background-color","green");
          } 
        });
        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/adicional.php", {produto:$(this).val(), tipo:2}, function(valor){ 
                    
		  var add = valor;
          var prod   = $("#produto").val();
                if(add>0){
                    $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/adicional.php", {produto:prod, tipo:1}, function(valorf){
            		   $("#add").css("display", "");
					   $("#add").html(valorf);
					   $('#incluir_produto').css("display", "");
					   $('#incluir_produto').removeAttr('disabled');
					   $('#bloco_produto').css("background-color","blue");
				    })
				} else{
                    $("#add").hide();
					$('#incluir_produto').css("display", "");
					$('#incluir_produto').removeAttr('disabled');
					$('#bloco_produto').css("background-color","green");
				}
        });
        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/fracao.php", {produto:$(this).val(), tipo:2}, function(valor){
		  var fracao = valor;
          var prod   = $("#produto").val();
				if(fracao>0){
				    $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/fracao.php", {produto:prod, tipo:1}, function(valorf){
                       $("#fracao").css("display", "");
					   $("#fracao").html(valorf);
					   $('#incluir_produto').css("display", "");
					   $('#incluir_produto').removeAttr('disabled');
				       $('#bloco_produto').css("background-color","blue");
				    })
				} else{
                    $("#fracao").hide();
					$('#incluir_produto').css("display", "");
					$('#incluir_produto').removeAttr('disabled');
					$('#bloco_produto').css("background-color","green");
                }
        });
        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/sabor.php", {produto:$(this).val(), tipo:2}, function(valor){
            
            var sabor = valor;
			var prod   = $("#produto").val();
				if(sabor>0){
                    $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/sabor.php", {produto:prod, tipo:1}, function(valorf){
            		    $("#sabor").css("display", "");
						$("#sabor").html(valorf);
						$('#incluir_produto').css("display", "");
						$('#incluir_produto').removeAttr('disabled');
						$('#bloco_produto').css("background-color","blue");
				    })
				} else{
                    $("#sabor").hide();
					$('#incluir_produto').css("display", "");
					$('#incluir_produto').removeAttr('disabled');
					$('#bloco_produto').css("background-color","green");
				}
        });
        $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/sabor.php", {produto:$(this).val(), tipo:2}, function(valor){
            
            var sabor = valor;
			var prod   = $("#produto").val();
				if(sabor>0){
                    $.post("http://192.168.1.200:8080/inova/jackbrown_mobile/jackbrown_php/function/sabor.php", {produto:prod, tipo:1}, function(valorf){
            		    $("#sabor2").css("display", "");
						$("#sabor2").html(valorf);
						$('#incluir_produto').css("display", "");
						$('#incluir_produto').removeAttr('disabled');
						$('#bloco_produto').css("background-color","blue");
				    })
				} else{
                    $("#sabor2").hide();
					$('#incluir_produto').css("display", "");
					$('#incluir_produto').removeAttr('disabled');
					$('#bloco_produto').css("background-color","green");
				}
        });
    });
     
    $(document).on("click", ".destaque", function(evt)
    {
       //var prod = $("#destaque_"+x).val();
        var prod = $(this).val();
        
        $("#produto").val(prod);
        $("#produto").focus();
    });
     
    $(document).on("click", ".uib_w_25", function(evt)
    {
        var produto = $("#produto").val();
        var qtd     = $("#qtd").val();
        var n_mesa   = $("#n_mesa").val();
        var n_cartao = $("#n_cartao").val();
        var sabor = $("#sabor").val();
        var sabor2 = $("#sabor2").val();
        var fracao = $("#fracao").val();
        var x = $("#x").val();
        //alert(x);
        var y = 0;
        var add = '';
        while (y < x) {
            
            var ys = $("#add"+y).val();
            if($("#add"+y).is(':checked')){
                add += ys+',';
            }
            y   =  y    +   1 ;
        }
        //alert(add);
        var z = $("#z").val();
        var y = 0;
        var rem = '';
        while (y < z) {
            
            var ys = $("#rem"+y).val();
            if($("#rem"+y).is(':checked')){
                rem += ys+',';
            }
            y   =  y    +   1 ;
        }
        //alert(rem);
        
        if(n_cartao==''){
            alert('n_cartao vazio');
        }
        if(n_mesa==''){
            n_mesa = 0;
        }
        if(n_cartao==''){
            n_cartao = 0;
        }
        
        $.ajax({
        type:"POST",
        url:"http://192.168.1.106:8080/jackbrown_mobile/jackbrown_php/cadastrar_venda.php",
        data:{n_cartao: n_cartao, n_mesa: n_mesa, produto: produto, qtd: qtd, add: add, rem: rem, sabor: sabor, sabor2: sabor2, fracao:fracao},
        timeout: 2000,
            success:function(resultado){
                $(".uib_w_20").html(resultado);
                $("#produto").val('');
                $("#sabor").hide();
                $("#sabor2").hide();
                $("#fracao").hide();
                $("#rem").hide();
                $("#add").hide();
                $("#nome_p").hide();
                style="display:none;"
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    activate_page("#cadastro_venda");
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario');
            }
        });
    });
    
        /* button  Button */
    $(document).on("click", ".uib_w_17", function(evt)
    {
         /*global activate_page */
         activate_page("#mesa"); 
         return false;
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
