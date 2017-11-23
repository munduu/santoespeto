/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 //$(".btn_entrar").onmousedown = function() {alert('asd');};
 function register_event_handlers()
 {
    //$('.loader').hide();

    function esconde_load(){
        $('.loader').hide();
    }
    
     //funcoes do COOKIE Inicio
     function setCookie(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
     }
     function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }  
        return "";
    }
     //funcoes do COOKIE Final
    
    

    function imprecao_total(n_mesa,n_cartao,user,tipo){

        $.ajax({
            type:"POST",
            url:url_geral+"imprimir.php",
            data:{n_cartao: n_cartao, n_mesa: n_mesa, user:user, tipo:tipo},
            timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide();                
                if(resultado!=''){
                    alert('Impressão Realizada !');
                }
                   
                /*$("#nome_p").hide();
                //style="display:none;"
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    activate_page("#cadastro_venda");
                }*/
            },
            error:function(resultado){
                alert('Erro na impressao de venda #005');
            }
        }); 
    }
	
	function mesa_nova(n_mesa, user){

        $.ajax({
            type:"POST",
            url:url_geral+"cadastrar_mesa.php",
            data:{n_cartao: n_mesa, user:user},
            timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide(); 
                if(resultado == 1){
                    alert('Mesa Aberta !');
					$('.btn_mesa').click();
                }else if(resultado == 2){
					alert('Campo Obrigatorio Vazio: NÚMERO MESA VAZIO!');
				}else if(resultado == 3){
					alert('Campo Obrigatorio Vazio: EVENTO NÃO SELECIONADOS, CONTATE A ADMINISTRAÇÃO.');
				}else if(resultado == 4){
					alert('MESA *** '+n_mesa+' *** JA ESTA ABERTA!');
				}					
                   
                /*$("#nome_p").hide();
                //style="display:none;"
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    activate_page("#cadastro_venda");
                }*/
            },
            error:function(resultado){
                alert('Erro no cadastro de mesa #001');
            }
        }); 
    }

    //Login Inicio object.onmousedown
    
    
    $(document).on("touchstart", ".foco_auto", function(evt)
    {
        var id_foco = $(this).attr('id');
        console.log(id_foco);
        $('#'+id_foco).focus();
    });

    $(document).on("touchstart", ".btn_entrar", function(evt)
    {
        
        var usuario = $("#usuario").val();
        var senha = $("#senha").val();
        if(usuario==''){
            alert('usuario vazio');
            return false;
        }
        if(senha==''){
            alert('senha vazia');
            return false;
        }
        
        $.ajax({
        type:"POST",
        crossDomain: true,
        dataType:"json",
        url:url_geral+"login.php",
        data:{usuario: usuario, senha: senha},
        timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide();
                if(resultado.nomeu==''){
                    //alert('NÃO DEU!');
                }else{
                    $("#n_usuario").val(usuario);
                    activate_page("#mesa");
                    setCookie("username", usuario, 30);
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario #001');
            }
        });
        
         return false;
    });
    //Login Fim 
    
    //Logout Inicio 
    $(document).on("touchstart", ".btn_sair", function(evt)
    {
        var pagina = $(this).attr('alt');
        if(pagina != ''){
            if(pagina == 'mainpage'){
                $("#n_usuario").val('');
                $("#usuario").val('');
                $("#senha").val('');
            }
            activate_page("#"+pagina);
        }   
    });
    //Logout Fim
    
	$(document).on("touchstart", ".btn_imp_parc", function(evt)
    {
        var n_mesa   = $("#n_mesa").val();
        var n_cartao = $("#n_cartao").val();
        var user     = $("#n_usuario").val();

        imprecao_total(n_mesa,n_cartao,user,'1');
    });

    $(document).on("touchstart", ".btn_fechar", function(evt)
    {
        var n_mesa   = $("#n_mesa").val();
        var n_cartao = $("#n_cartao").val();
        var user     = $("#n_usuario").val();

        imprecao_total(n_mesa,n_cartao,user,'2');
    });
	
	$(document).on("touchstart", ".btn_abrir_mesa", function(evt)
    {
        var n_mesa   = $("#n_cartao_novo").val();
		var user     = $("#n_usuario").val();

        mesa_nova(n_mesa, user);
    });
	
    //Seleção de mesa Inicio  
    $(document).on("touchstart", ".btn_mesa", function(evt)
    {     
        var n_cartao = $("#n_cartao").val();
        var n_mesa   = $("#n_mesa").val();
        var user     =getCookie("username");
        
        if(n_cartao==''){
            alert('Nº Cartao vazio!');
            return false;
        }
        if(n_mesa==''){
            n_mesa = 0;
        }
        
        //Conferindo se o cartão esta ativo Inicio 
        $.ajax({
        type:"POST",
        dataType:"json",
        url:url_geral+"cartao.php",
        data:{n_cartao: n_cartao},
        timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide();
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else if(resultado.caminho == '2'){
                    activate_page("#cadastro_venda");
                }else{
                    activate_page("#cadastro_mesa");
                    $('#n_cartao_novo').val(n_cartao);
                    //alert("Cartao não Cadastrado!");
                }
            },
            error:function(resultado){
                alert('Erro!');
            }
        });
        //Conferindo se o cartão esta ativo Fim 
        
        //Listando produtos ja pedidos Inicio 
        $.ajax({
        type:"POST",
        url:url_geral+"listar_venda.php",
        data:{n_cartao: n_cartao, n_mesa: n_mesa},
        timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide();
                $("#produto").val('');
				$("#qtd").val('1');
                
                /*$("#sabor").hide();
                $("#sabor").val('0');
                
                $("#sabor2").hide();
                $("#sabor2").val('0');
                
                $("#fracao").hide();
                $("#fracao").val('0');
                
                $("#rem").hide();
                $("#rem").empty();
        
                $("#add").hide();
                $("#add").empty();*/
                $("#nome_p").hide();
                $(".uib_w_20").html(resultado);
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    $(".n_mesa").val(n_cartao);
                
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario #002');
            }
        });
        //Listando produtos ja pedidos IFim 
        
        //Produtos em destaque Inicio 
        $.ajax({
        type:"POST",
        url:url_geral+"destaque.php",
        data:{n_cartao: n_cartao, n_mesa: n_mesa},
        timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide();
                 $(".uib_w_31").html(resultado);
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    $(".n_mesa").val(n_mesa);
                     
                }
            },
            error:function(resultado){
                alert('Erro no nome do usuario #003');
            }
        });
        //Produtos em destaque Fim 
        
    });
     //Seleção de mesa Fim 
    
     //BUSCA PRODUTO INICIO
     /*$(document).ready(function() {
         $('input.typeahead-devs').typeahead({
            name: 'produto',
            remote : 'http://192.168.0.2:1020/app/produto_busca.php?query=%QUERY'
         });
     })*/
     //BUSCA PRODUTO FIM
     
     //Seleção de produtos removidos, adicionados, sabores e fração + nome do produto Inicio 
    $("#produto").blur(function(){ 
        
        $.post(url_geral+"function/nome_produto.php", {produto:$(this).val(), tipo:2}, function(valor){
          var nome_p 	= valor;
		  var prod   	= $("#produto").val();
          var qtd   	= $("#qtd").val();
		        $.post(url_geral+"function/nome_produto.php", {produto:prod, qtd:qtd, tipo:1}, function(valorf){
                $("#nome_p").css("display", "");
				$("#nome_p").html(valorf);
				$('#incluir_produto').css("display", "");
				$('#incluir_produto').removeAttr('disabled');
				$('#bloco_produto').css("background-color","blue");
                  
              })
        });
        $.post(url_geral+"function/remocao.php", {produto:$(this).val(), tipo:2}, function(valor){ 
          var rem 	= valor;
		  var prod   	= $("#produto").val();        
          $("#rem").empty();
            
		  if(rem>0){
		      $.post(url_geral+"function/remocao.php", {produto:prod, tipo:1}, function(valorf){
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
        $.post(url_geral+"function/adicional.php", {produto:$(this).val(), tipo:2}, function(valor){ 
                    
		  var add = valor;
          var prod   = $("#produto").val();
          $("#add").empty();
            
                if(add>0){
                    $.post(url_geral+"function/adicional.php", {produto:prod, tipo:1}, function(valorf){
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
        $.post(url_geral+"function/fracao.php", {produto:$(this).val(), tipo:2}, function(valor){
            
          $("#fracao").val('0');
		  var fracao = valor;
          var prod   = $("#produto").val();
				if(fracao>0){
				    $.post(url_geral+"function/fracao.php", {produto:prod, tipo:1}, function(valorf){
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
        $.post(url_geral+"function/sabor.php", {produto:$(this).val(), tipo:2}, function(valor){
            
            $("#sabor").val('0');
            var sabor = valor;
			var prod   = $("#produto").val();
				if(sabor>0){
                    $.post(url_geral+"function/sabor.php", {produto:prod, tipo:1}, function(valorf){
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
        $.post(url_geral+"function/sabor.php", {produto:$(this).val(), tipo:2}, function(valor){
            
            $("#sabor2").val('0');
            var sabor = valor;
			var prod   = $("#produto").val();
				if(sabor>0){
                    $.post(url_geral+"function/sabor.php", {produto:prod, tipo:1}, function(valorf){
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
     //Seleção de produtos removidos, adicionados, sabores e fração + nome do produto Fim 
     
     //Função dos produtos em destaque Inicio 
    $(document).on("touchstart", ".destaque", function(evt)
    {
        var prod = $(this).val();
        
        $("#produto").val(prod);
        $("#produto").focus();
    });
     //Função dos produtos em destaque Fim 
     
     //Cadastro de venda Inicio      
    $(document).on("touchstart", ".btn_incluir", function(evt)
    {
        var produto  = $("#produto").val();
        var qtd      = $("#qtd").val();
        var n_mesa   = $("#n_mesa").val();
        var n_cartao = $("#n_cartao").val();
        /*var sabor    = $("#sabor").val();
        var sabor2   = $("#sabor2").val();
        var fracao   = $("#fracao").val();*/ 
        var user     = $("#n_usuario").val();

        if(produto == ''){
            alert('Nenhum Codigo Digitado!');
            //$('.btn_mesa').click();
            return false;
        }

        /*
        var x        = $("#x").val();
        var y = 0;
        var add = '';
        while (y < x) {
            
            var ys = $("#add"+y).val();
            if($("#add"+y).is(':checked')){
                add += ys+',';
            }
            y   =  y    +   1 ;
        }
        
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
        */
        if(n_cartao==''){
            alert('n_cartao vazio');
        }
        if(n_mesa==''){
            n_mesa = 0;
        }
        if(n_cartao==''){
            n_cartao = 0;
        }       
       
        /*
        data:{n_cartao: n_cartao, n_mesa: n_mesa, produto: produto, qtd: qtd, user:user},
        
        */
        //, add: add, rem: rem, sabor: sabor, sabor2: sabor2, fracao:fracao
        $.ajax({
        type:"POST",
        url:url_geral+"cadastrar_venda.php",
        data:{n_cartao: n_cartao, n_mesa: n_mesa, produto: produto, qtd: qtd, user:user},
        timeout: 10000,
            beforeSend: function(resultado){ 
                $('.loader').show();
            },
            success:function(resultado){
                $('.loader').hide();
                // alert ($("#n_usuario").val());
                $(".uib_w_20").html(resultado);
                $("#produto").val('');
				$("#qtd").val('1');
                
                /*$("#sabor").hide();
                $("#sabor").val('0');
                
                $("#sabor2").hide();
                $("#sabor2").val('0');
                
                $("#fracao").hide();
                $("#fracao").val('0');
                
                $("#rem").hide();
                $("#rem").empty();
        
                $("#add").hide();
                $("#add").empty();*/
                
                $("#nome_p").hide();
                //style="display:none;"
                if(resultado.caminho==''){
                    alert('NÃO DEU!');
                }else{ 
                    activate_page("#cadastro_venda");
                }
            },
            error:function(resultado){
                alert('Erro no cadastro de venda #004');
            }
        });
    });
     //Cadastro de venda Fim 
    
        /* button  Button */
    $(document).on("touchstart", ".uib_w_17", function(evt)
    {
         /*global activate_page */
         activate_page("#mesa"); 
         return false;
    });

    esconde_load();
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
