@echo off
title Enviando para o GitHub
powershell.exe -NoExit -ExecutionPolicy Bypass -Command "Set-Location '\\sn928escoladfp1\pastas alunos$\45176946823\Desktop\TESTE SKILL'; Write-Host '=== ENVIANDO PROJETO DESVENDA PARA O GITHUB ===' -ForegroundColor Cyan; Write-Host 'Repositorio: https://github.com/pedrolebron01/TESTESKILL' -ForegroundColor Yellow; Write-Host ''; git push -u origin main; Write-Host ''; Write-Host 'Se o envio foi concluido com sucesso, pode fechar esta janela!' -ForegroundColor Green"
