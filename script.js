const quizEl = document.getElementById('quiz');
const submitBtn = document.getElementById('submitBtn');
const resultEl = document.getElementById('result');
const newQuizBtn = document.getElementById('newQuizBtn');

const names = ["Ani","Budi","Caca","Doni","Eka","Fajar","Gita","Hasbi","Ibu Ida","Joni","Kiki","Lina","Maya","Nina","Omar","Putri","Qori","Raka","Siti","Tono","Udin","Wati","Yani","Zara"];
const objects = ["apel","buku","bolpoin","pensil","kue","botol","permen","jeruk","roti","kertas","stiker","donat","gelas","sendok","sabun"];
const places = ["rumah","sekolah","taman","warung","perpustakaan","lapangan","kantin","pasar"];
const containers = ["botol besar","botol kecil","gelas","wadah"];
const units = ["liter","meter","kilogram"];

let questions = [];
let answers = [];

function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function uniqueOptions(correct, decoys){
  const set = new Set([String(correct)]);
  const opts = [correct];
  for(const d of decoys){
    if(!set.has(String(d))){
      set.add(String(d));
      opts.push(d);
    }
    if(opts.length === 4) break;
  }
  while(opts.length < 4){
    const fallback = correct + randInt(1, 9) * (Math.random() < 0.5 ? -1 : 1);
    if(!set.has(String(fallback))){
      set.add(String(fallback));
      opts.push(fallback);
    }
  }
  return shuffle(opts);
}

function formatNumber(n){
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

function genMathXY(){
  const x = randInt(2, 18);
  const y = randInt(2, 9);
  const ans = x + (y * y);
  const q = `X = ${x} dan Y = ${y}. Berapa nilai X + Y²?`;
  const options = uniqueOptions(ans, [ans + 1, ans - 2, ans + 4, ans - 5, ans + 8]);
  return { key:`xy-${x}-${y}`, q, options, ans };
}

function genMoneyStory(){
  const price = randInt(2, 9) * 1000;
  const qty = randInt(2, 8);
  const ans = price * qty;
  const name = names[randInt(0, names.length - 1)];
  const obj = objects[randInt(0, objects.length - 1)];
  const q = `${name} membeli ${qty} ${obj} dengan harga Rp${price.toLocaleString('id-ID')} per buah. Berapa total uang yang harus dibayar?`;
  const options = uniqueOptions(ans, [ans + 1000, ans - 2000, ans + 3000, ans - 1000, ans + 5000]);
  return { key:`money-${price}-${qty}`, q, options, ans };
}

function genLiterSplit(){
  const liters = randInt(2, 9);
  const parts = randInt(2, 5);
  const ans = liters / parts;
  const name = names[randInt(0, names.length - 1)];
  const q = `${name} mempunyai ${liters} liter air. Air itu dibagi sama banyak ke ${parts} wadah. Berapa liter tiap wadah?`;
  const options = uniqueOptions(ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 0.5]);
  return { key:`liter-${liters}-${parts}`, q, options, ans };
}

function genMilliliterConvert(){
  const liters = randInt(1, 8);
  const ans = liters * 1000;
  const place = places[randInt(0, places.length - 1)];
  const q = `Di ${place}, ada ${liters} liter susu. Berapa mililiter susu itu?`;
  const options = uniqueOptions(ans, [ans + 500, ans - 500, ans + 1000, ans - 1000, ans + 250]);
  return { key:`ml-${liters}`, q, options, ans };
}

function genLengthConvert(){
  const meters = randInt(2, 20);
  const ans = meters * 100;
  const obj = objects[randInt(0, objects.length - 1)];
  const q = `Panjang tali adalah ${meters} meter. Berapa sentimeter panjang tali itu?`;
  const options = uniqueOptions(ans, [ans + 10, ans - 20, ans + 100, ans - 100, ans + 50]);
  return { key:`length-${meters}`, q, options, ans };
}

function genWeightConvert(){
  const kg = randInt(2, 12);
  const ans = kg * 1000;
  const name = names[randInt(0, names.length - 1)];
  const q = `${name} membeli beras ${kg} kilogram. Berapa gram beras itu?`;
  const options = uniqueOptions(ans, [ans + 250, ans - 250, ans + 500, ans - 500, ans + 1000]);
  return { key:`weight-${kg}`, q, options, ans };
}

function genSpeedTime(){
  const speed = randInt(3, 12);
  const time = randInt(2, 8);
  const ans = speed * time;
  const name = names[randInt(0, names.length - 1)];
  const place = places[randInt(0, places.length - 1)];
  const q = `${name} bersepeda dengan kecepatan ${speed} km/jam selama ${time} jam dari rumah ke ${place}. Berapa jarak yang ditempuh?`;
  const options = uniqueOptions(ans, [ans + 2, ans - 3, ans + 5, ans - 4, ans + 6]);
  return { key:`speed-${speed}-${time}`, q, options, ans };
}

function genDistanceTime(){
  const distance = randInt(20, 120);
  const speed = randInt(5, 20);
  const ans = distance / speed;
  if(!Number.isInteger(ans)) return genDistanceTime();
  const name = names[randInt(0, names.length - 1)];
  const q = `Sebuah mobil menempuh jarak ${distance} km dengan kecepatan ${speed} km/jam. Berapa jam waktu yang dibutuhkan?`;
  const options = uniqueOptions(ans, [ans + 1, ans - 1, ans + 2, ans + 3, ans - 2]);
  return { key:`disttime-${distance}-${speed}`, q, options, ans };
}

function genBottleStory(){
  const large = randInt(4, 10);
  const half = randInt(2, 6);
  const totalLarge = randInt(2, 5);
  const totalHalf = randInt(2, 8);
  const volumeLarge = large; // one "large bottle" = 1 unit in liters
  const volumeSmall = large / 2;
  const ans = (totalLarge * volumeLarge) + (totalHalf * volumeSmall);
  const name = names[randInt(0, names.length - 1)];
  const q = `Bu ${name} menghasilkan ${totalLarge} wadah dengan isi masing-masing ${large/2} liter, lalu dituangkan ke ${totalHalf} botol kecil yang isinya setengah dari botol besar. Berapa liter jumlah seluruh isi?`;
  const options = uniqueOptions(ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3]);
  return { key:`bottle-${large}-${totalLarge}-${totalHalf}`, q, options, ans };
}

function genSharing(){
  const total = randInt(12, 60);
  const people = randInt(2, 10);
  const ans = total / people;
  if(!Number.isInteger(ans)) return genSharing();
  const name = names[randInt(0, names.length - 1)];
  const obj = objects[randInt(0, objects.length - 1)];
  const q = `${name} memiliki ${total} ${obj} dan ingin membagikannya sama banyak kepada ${people} teman. Berapa ${obj} yang diterima setiap teman?`;
  const options = uniqueOptions(ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3]);
  return { key:`share-${total}-${people}`, q, options, ans };
}

function genPerimeter(){
  const p = randInt(3, 15);
  const l = randInt(4, 20);
  const ans = 2 * (p + l);
  const q = `Sebuah persegi panjang memiliki panjang ${p} cm dan lebar ${l} cm. Berapa kelilingnya?`;
  const options = uniqueOptions(ans, [ans + 2, ans - 2, ans + 4, ans - 4, ans + 6]);
  return { key:`perim-${p}-${l}`, q, options, ans };
}

function genAverageStyle(){
  const a = randInt(3, 18);
  const b = randInt(3, 18);
  const c = randInt(3, 18);
  const ans = a + b + c;
  const q = `Ada ${a} apel, ${b} apel, dan ${c} apel di tiga keranjang. Berapa jumlah seluruh apel?`;
  const options = uniqueOptions(ans, [ans + 1, ans - 1, ans + 3, ans - 3, ans + 5]);
  return { key:`sum-${a}-${b}-${c}`, q, options, ans };
}

function genTwoStep(){
  const x = randInt(2, 9);
  const y = randInt(2, 9);
  const z = randInt(2, 9);
  const ans = x * y + z;
  const q = `Hitung hasil dari ${x} × ${y} + ${z}.`;
  const options = uniqueOptions(ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3]);
  return { key:`twostep-${x}-${y}-${z}`, q, options, ans };
}

const generators = [
  genMathXY,
  genMoneyStory,
  genLiterSplit,
  genMilliliterConvert,
  genLengthConvert,
  genWeightConvert,
  genSpeedTime,
  genDistanceTime,
  genBottleStory,
  genSharing,
  genPerimeter,
  genAverageStyle,
  genTwoStep
];

function createQuiz(){
  questions = [];
  answers = [];
  quizEl.innerHTML = '';
  resultEl.classList.add('hidden');
  resultEl.textContent = '';
  submitBtn.disabled = true;

  const used = new Set();
  let guard = 0;
  while(questions.length < 10 && guard < 500){
    guard++;
    const g = generators[randInt(0, generators.length - 1)]();
    if(used.has(g.key)) continue;
    used.add(g.key);
    questions.push(g);
  }

  questions.forEach((item, idx) => {
    answers[idx] = null;

    const card = document.createElement('article');
    card.className = 'question-card';

    const top = document.createElement('div');
    top.className = 'q-top';

    const num = document.createElement('div');
    num.className = 'q-number';
    num.textContent = idx + 1;

    const text = document.createElement('p');
    text.className = 'q-text';
    text.textContent = item.q;

    top.appendChild(num);
    top.appendChild(text);

    const options = document.createElement('div');
    options.className = 'options';

    item.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = formatNumber(opt);
      btn.addEventListener('click', () => selectAnswer(idx, opt, card, options));
      options.appendChild(btn);
    });

    card.appendChild(top);
    card.appendChild(options);
    quizEl.appendChild(card);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectAnswer(qIndex, value, card, optionsWrap){
  answers[qIndex] = value;

  const buttons = [...optionsWrap.querySelectorAll('.option-btn')];
  buttons.forEach(btn => {
    btn.classList.remove('selected');
    if(btn.textContent === formatNumber(value)){
      btn.classList.add('selected');
    }
  });

  submitBtn.disabled = answers.some(a => a === null);

  // Save selected answer to the card dataset
  card.dataset.selected = String(value);
}

function submitQuiz(){
  if(answers.some(a => a === null)) return;

  // auto scroll ke atas
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  let correctCount = 0;

  questions.forEach((q, idx) => {
    const card = quizEl.children[idx];
    const buttons = [...card.querySelectorAll('.option-btn')];

    buttons.forEach(btn => {
      btn.disabled = true;
      const btnValue = Number(btn.textContent.replace(/\./g, '').replace(/,/g, ''));
      if(btnValue === q.ans){
        btn.classList.add('correct');
      }
      if(answers[idx] !== q.ans && btnValue === answers[idx]){
        btn.classList.add('wrong');
      }
    });

    if(answers[idx] === q.ans) correctCount++;
  });

  const persen = Math.round((correctCount / questions.length) * 100);

  let warna = "#4CAF50";
  if(persen < 60){
    warna = "#f44336";
  } else if(persen < 80){
    warna = "#FFC107";
  }

  resultEl.classList.remove('hidden');
  resultEl.innerHTML =
    `Skor kamu: ${correctCount} / ${questions.length}
     <br>
     <span style="font-size:28px;font-weight:bold;color:${warna}">
     ${persen}%
     </span>`;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sudah Dikirim';
  submitBtn.style.opacity = '0.9';
}
window.scrollTo({ top: 0, behavior: "smooth" });

document.getElementById("overlay").classList.remove("hidden");
document.getElementById("popup").classList.remove("hidden");

submitBtn.addEventListener('click', submitQuiz);
newQuizBtn.addEventListener('click', createQuiz);

createQuiz();
