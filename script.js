class SpinWheel {
    constructor() {
        this.wheel = document.getElementById('wheel');
        this.spinBtn = document.getElementById('spinBtn');
        this.popup = document.getElementById('popup');
        this.selectedNumberSpan = document.getElementById('selectedNumber');
        this.closePopupBtn = document.getElementById('closePopup');
        this.wheelSections = document.getElementById('wheelSections');
        
        this.isSpinning = false;
        this.currentRotation = 0;
        this.availableChallenges = [
            "Sing a song in diff. lang",
            "Pick-up line for someone in audience",
            "Propose a random object",
            "Call a contact and sing romantic song",
            "Dance with a same birth month person",
            "Reveal a secret that nobody knows",
            "Dance on a song",
            "Tongue Twisters - 3 times"
        ];
        this.colors = ['#ed327c', '#198b88', '#b65b82','#546065'];
        
        this.init();
        this.initializeWheelSections();
    }
    
    init() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.closePopupBtn.addEventListener('click', () => this.closePopup());
    }
    
    initializeWheelSections() {
        this.updateWheelSections();
    }
    
    spin() {
        if (this.isSpinning || this.availableChallenges.length === 0) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.spinBtn.textContent = 'Spinning...';
        
        const fullRotations = 5 + Math.random() * 5; 
        const randomAngle = Math.random() * 360;
        const totalRotation = this.currentRotation + (fullRotations * 360) + randomAngle;
        
        this.wheel.style.transform = `rotate(${totalRotation}deg)`;
        this.currentRotation = totalRotation % 360;
        
        setTimeout(() => {
            this.handleSpinComplete();
        }, 4000); 
    }
    
    handleSpinComplete() {
        this.isSpinning = false;
        this.spinBtn.disabled = false;
        this.spinBtn.textContent = 'SPIN!';
        
        const normalizedRotation = (360 - (this.currentRotation % 360)) % 360;
        const sectionAngle = 360 / this.availableChallenges.length;
        const selectedIndex = Math.floor(normalizedRotation / sectionAngle);
        
        if (selectedIndex < this.availableChallenges.length) {
            const selectedChallenge = this.availableChallenges[selectedIndex];
            this.showPopup(selectedChallenge);
        }
    }
    
    showPopup(challenge) {
        this.selectedNumberSpan.textContent = challenge;
        this.popup.style.display = 'block';
        
        // Trigger confetti burst
        this.createConfettiBurst();
        
        this.availableChallenges = this.availableChallenges.filter(c => c !== challenge);
        
        this.updateWheelSections();
        
        if (this.availableChallenges.length === 0) {
            this.spinBtn.textContent = 'All Done!';
            this.spinBtn.disabled = true;
        }
    }
    
    createConfettiBurst() {
        const colors = ['#ff4444', '#44ff44', '#ffff44', '#4444ff', '#ff44ff', '#44ffff', '#ff8844', '#8844ff'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 10);
        }
    }
    
    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = color;
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Animation
        const animation = confetti.animate([
            { 
                transform: 'translateY(0px) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`,
                opacity: 0
            }
        ], {
            duration: 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
    
    closePopup() {
        this.popup.style.display = 'none';
    }
    
    updateWheelSections() {
        this.wheelSections.innerHTML = '';
        if (this.availableChallenges.length === 0) return;
    
        const centerX = 500;
        const centerY = 500;
        const radius = 450;
        const sectionAngle = 360 / this.availableChallenges.length;
    
        this.availableChallenges.forEach((challenge, index) => {
            const startAngle = (index * sectionAngle - 90) * Math.PI / 180;
            const endAngle = ((index + 1) * sectionAngle - 90) * Math.PI / 180;
    
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);
    
            const largeArcFlag = sectionAngle > 180 ? 1 : 0;
    
            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', this.colors[index % 4]);
            path.setAttribute('data-challenge', challenge);
    
            // --- Text positioning ---
            const midAngle = (startAngle + endAngle) / 2;
            const textRadius = radius * 0.55;
            const textX = centerX + textRadius * Math.cos(midAngle);
            const textY = centerY + textRadius * Math.sin(midAngle);
    
            const angleDeg = (midAngle * 180 / Math.PI);
    
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textX);
            text.setAttribute('y', textY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('transform', `rotate(${angleDeg}, ${textX}, ${textY})`);
    
            // --- Dynamic font scaling ---
            let baseFont = 1;
            if (this.availableChallenges.length > 8) baseFont = 0.5;
            let fontSize = Math.max(0.5, baseFont - Math.floor(challenge.length / 15));
            text.setAttribute('font-size', fontSize);
    
            // --- Hard wrapping into multiple lines ---
            const maxCharsPerLine = Math.max(12, Math.floor(sectionAngle / 8)); // depends on slice width
            let words = challenge.split(' ');
            let line = '';
            let lines = [];
    
            words.forEach(word => {
                if ((line + word).length <= maxCharsPerLine) {
                    line += (line ? ' ' : '') + word;
                } else {
                    lines.push(line);
                    line = word;
                }
            });
            if (line) lines.push(line);
    
            // Center multiline vertically
            const totalLines = lines.length;
            lines.forEach((ln, i) => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.setAttribute('x', textX);
                tspan.setAttribute('dy', (i === 0 ? -(totalLines - 1) * 0.6 + "em" : "1.2em"));
                tspan.textContent = ln;
                text.appendChild(tspan);
            });
    
            this.wheelSections.appendChild(path);
            this.wheelSections.appendChild(text);
        });
    }
    
    
}

// Initialize the wheel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpinWheel();
});
