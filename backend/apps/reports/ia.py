import anthropic
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny 

class AssistenteIAView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            mensagens = request.data.get('mensagens', [])
            contexto = request.data.get('contexto', '')

            if not mensagens or not contexto:
                return Response({'erro': 'Dados insuficientes.'}, status=400)

            api_key = os.environ.get("ANTHROPIC_API_KEY")
            client = anthropic.Anthropic(api_key=api_key)
            
            # Garantindo que a primeira mensagem não seja do assistente (exigência da Anthropic)
            if mensagens and mensagens[0].get('role') == 'assistant':
                mensagens.pop(0)

            resposta = client.messages.create(
                model='claude-3-5-sonnet-20240620', 
                max_tokens=1000,
                system=contexto,
                messages=mensagens
            )
            
            return Response({'resposta': resposta.content[0].text})
            
        except Exception as e:
            print(f"ERRO IA: {str(e)}")
            return Response({'erro': str(e)}, status=500)