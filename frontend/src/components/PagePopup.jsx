import { useState } from "react";

export function PagePopup() {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-2">
          Geliştirme ve Bilgilendirme Duyurusu
        </h2>
        <h2 className="text-xl font-semibold mb-2">
          Development and Information Announcement
        </h2>
        <p className="text-gray-600 mb-4">
          Bu web sitesi şu anda geliştirme / hazırlık aşamasındadır. Sitede yer
          alan içerikler bilgilendirme ve tanıtım amaçlıdır. Web sitesi
          üzerinden aktif olarak herhangi bir satış, rezervasyon veya ödeme alma
          işlemi yapılmamaktadır. Tur programları ve içerikler henüz aktif
          satışta değildir. Yetkili bir seyahat acentesi ile anlaşma
          sağlandıktan sonra gerekli düzenlemeler yapılacak ve site aktif hale
          getirilecektir.
        </p>
        <p>
          This website is currently under development/preparation. The content
          on this site is for informational and promotional purposes only. No
          sales, reservations, or payments are actively processed through this
          website. Tour programs and content are not yet actively for sale. Once
          an agreement is reached with an authorized travel agency, the
          necessary arrangements will be made and the site will be activated.
        </p>

        <button
          onClick={() => setOpen(false)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
