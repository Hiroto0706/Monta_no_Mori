import "./Footer.css";

export default function Footer() {
  return (
    <>
      <div className="footer__contents">
        <span className="copyright">&copy; 2024 もんたの森</span>
        <div className="footer__links">
          <a href="/about">ご利用規約</a>
          <a href="https://mamimumemonta.netlify.app/about" target="_blank">ワイについて</a>
        </div>
      </div>

      <div className="footer__img">
        <img src="/monta_no_mori_footer.png" />
      </div>
    </>
  );
}
