# monta_no_mori
https://montanomori.netlify.app/

## ざっくりアーキテクチャ

![もんたの森アーキテクチャ](https://github.com/Hiroto0706/monta_no_mori/assets/87826418/afc81732-0528-453f-bbc8-029899d3b114)

フロントはVite（React　×　TypeScript）、サーバーサイドはGo、データベースはPostgres、画像ストレージはGCSを使用しています。

フロントより保存したい画像が送られてくると、画像のデータはGCSに保存し、Postgresには画像のパスを保存することで、画像にアクセスすることができるようになっています。

デプロイはフロントエンドが[Neflify](https://www.netlify.com/)、サーバーサイドは[Fly.io](https://fly.io/)を使用してデプロイしています。
