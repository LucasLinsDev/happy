let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  released = false;  // Flag para controlar quando a imagem foi solta

  init(paper) {
    const moveHandler = (e) => {
      let clientX, clientY;

      if (e.type.includes("touch")) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX * 2;  // Aumentar a velocidade do movimento horizontal
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

        // Caso a imagem ultrapasse a tela, vamos aplicar um efeito de arremesso
        if (this.released) {
          // Aplicando um impulso adicional para o lado (arremesso)
          if (this.currentPaperX > window.innerWidth / 2 || this.currentPaperX < -window.innerWidth / 2) {
            const direction = this.currentPaperX > 0 ? 1 : -1;
            this.currentPaperX += direction * 1500;  // Impulso adicional ao arremessar
            paper.style.transition = "transform 0.5s ease-out";  // Transição suave
            setTimeout(() => {
              paper.style.display = "none";  // Opcional: esconder após o movimento (aqui se não quiser manter visível)
            }, 500);  // Tempo da transição
          }
        }
      }
    };

    const startHandler = (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.released = false;  // Resetar a flag de "lançamento"

      let clientX, clientY;
      if (e.type.includes("touch")) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
      this.released = true;  // Marcar como "solto" para aplicar o impulso
    };

    // Eventos para desktop
    document.addEventListener("mousemove", moveHandler);
    paper.addEventListener("mousedown", startHandler);
    window.addEventListener("mouseup", endHandler);

    // Eventos para mobile
    document.addEventListener("touchmove", moveHandler, { passive: false });
    paper.addEventListener("touchstart", startHandler, { passive: false });
    window.addEventListener("touchend", endHandler);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
