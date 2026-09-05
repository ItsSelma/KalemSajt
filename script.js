/*
   KALEM — script.js

   Tri stvari:
   1. otvaranje menija na telefonu
   2. filtriranje cjenovnika
   3. provjera kontakt forme (bez servera)

   Pravilo kojeg se držimo: JavaScript dodaje i uklanja
   klase, a sav izgled ostaje u CSS-u.
    */

/* 
   1. MENI NA TELEFONU
   */

const meniDugme = document.getElementById("meniDugme");
const meni = document.getElementById("meni");

meniDugme.addEventListener("click", function () {
  const otvoren = meni.classList.toggle("je-otvoren");

  meniDugme.setAttribute("aria-expanded", otvoren);

  meniDugme.querySelector(".vidljivo-citacu").textContent = otvoren
    ? "Zatvori meni"
    : "Otvori meni";
});

// klik na stavku zatvara meni
meni.querySelectorAll("a").forEach(function (veza) {
  veza.addEventListener("click", function () {
    meni.classList.remove("je-otvoren");
    meniDugme.setAttribute("aria-expanded", "false");
  });
});

/* 
   2. FILTRIRANJE CJENOVNIKA

   Svaki red tabele ima data-grupa (sobno, vrtno, rasad).
   Dugme ima isti data-grupa, pa ih uparujemo.
 */

const filteri = document.querySelectorAll(".filter");
const redovi = document.querySelectorAll("#tijeloCjenovnika tr");

filteri.forEach(function (dugme) {
  dugme.addEventListener("click", function () {
    // označi kliknuto dugme kao aktivno
    filteri.forEach(function (d) {
      d.classList.remove("je-aktivan");
    });
    dugme.classList.add("je-aktivan");

    const trazena = dugme.dataset.grupa;

    // sakrij redove koji ne pripadaju odabranoj grupi
    redovi.forEach(function (red) {
      if (trazena === "sve" || red.dataset.grupa === trazena) {
        red.classList.remove("je-skriven");
      } else {
        red.classList.add("je-skriven");
      }
    });
  });
});

/*
   3. KONTAKT FORMA

   Forma nema server. Provjeravamo unos i ispisujemo
   poruku, a slanje zaustavljamo sa preventDefault().
 */

const forma = document.getElementById("forma");
const potvrda = document.getElementById("potvrda");

// Pomoćna funkcija: upiši ili obriši poruku o grešci
function oznaci(poljeId, greskaId, poruka) {
  const polje = document.getElementById(poljeId);
  const greska = document.getElementById(greskaId);

  greska.textContent = poruka;

  if (poruka === "") {
    polje.classList.remove("nije-ok");
    return true; // polje je ispravno
  }

  polje.classList.add("nije-ok");
  return false; // polje nije ispravno
}

forma.addEventListener("submit", function (dogadjaj) {
  // zaustavi slanje — nema servera koji bi primio podatke
  dogadjaj.preventDefault();

  const ime = document.getElementById("ime").value.trim();
  const email = document.getElementById("email").value.trim();
  const poruka = document.getElementById("poruka").value.trim();

  let sveOk = true;

  //  ime
  if (ime === "") {
    oznaci("ime", "greskaIme", "Upišite ime da znamo kome odgovaramo.");
    sveOk = false;
  } else {
    oznaci("ime", "greskaIme", "");
  }

  // email
  // Jednostavna provjera: mora imati @ i tačku iza njega.
  if (email === "") {
    oznaci("email", "greskaEmail", "Bez email adrese ne možemo odgovoriti.");
    sveOk = false;
  } else if (email.includes("@") === false || email.includes(".") === false) {
    oznaci("email", "greskaEmail", "Provjerite adresu, nedostaje @ ili tačka.");
    sveOk = false;
  } else {
    oznaci("email", "greskaEmail", "");
  }

  //  poruka
  if (poruka.length < 10) {
    oznaci(
      "poruka",
      "greskaPoruka",
      "Napišite bar rečenicu, lakše ćemo pomoći.",
    );
    sveOk = false;
  } else {
    oznaci("poruka", "greskaPoruka", "");
  }

  // rezultat
  if (sveOk === false) {
    potvrda.hidden = true;

    forma.querySelector(".nije-ok").focus();
    return;
  }

  potvrda.textContent =
    "Hvala, " +
    ime +
    ". Upit je provjeren i spreman za slanje. " +
    "Ova vježba nema server, pa poruka ne odlazi nikuda.";

  potvrda.hidden = false;

  forma.reset();
});
