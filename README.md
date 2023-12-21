# monta_no_mori
https://montanomori.netlify.app/

## ざっくりアーキテクチャ

![もんたの森_アーキテクチャ](https://github.com/Hiroto0706/monta_no_mori/assets/87826418/7f17c9b0-4a87-4f54-97da-65f60d092956)

フロントはReactとTypeScript、サーバーサイドはGo、データベースはPostgres、画像ストレージはGCSを使用しています。

フロントより保存したい画像が送られてくると、画像のデータはGCSに保存し、Postgresには画像のパスを保存することで、画像にアクセスすることができるようになっています。

デプロイはフロントエンドが[Neflify](https://www.netlify.com/)、サーバーサイドは[Fly.io](https://fly.io/)を使用してデプロイしています。
