import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Reclamation } from '../models/reclamation.model';
import { SuiviReclamation } from '../models/suivi.model';

@Injectable({ providedIn: 'root' })
export class PdfService {

  generateReclamationPdf(reclamation: Reclamation, suivis: SuiviReclamation[]): void {
    // Filter out internal notes — clients should never see them
    const visibleSuivis = suivis.filter(s => s.action !== 'INTERNAL_NOTE' as any);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // ── Header ──────────────────────────────────────────────
    doc.setFillColor(79, 70, 229); // indigo
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Réclamation Client', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Référence #${reclamation.id}`, pageWidth / 2, 25, { align: 'center' });

    y = 50;
    doc.setTextColor(0, 0, 0);

    // ── Statut badge ────────────────────────────────────────
    const statutColors: Record<string, number[]> = {
      EN_ATTENTE: [245, 158, 11],
      EN_COURS:   [79, 70, 229],
      TRAITEE:    [16, 185, 129]
    };
    const color = statutColors[reclamation.statut || 'EN_ATTENTE'] || [100, 100, 100];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(14, y - 6, 45, 10, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(reclamation.statut || '', 36, y + 1, { align: 'center' });

    y += 15;
    doc.setTextColor(0, 0, 0);

    // ── Info section ────────────────────────────────────────
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y - 5, pageWidth - 28, 55, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y - 5, pageWidth - 28, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('INFORMATIONS', 20, y + 3);

    y += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const infos = [
      ['Client',      reclamation.clientNom || '—'],
      ['Produit',     reclamation.produit],
      ['Date',        reclamation.date ? new Date(reclamation.date).toLocaleDateString('fr-FR') : '—'],
      ['Agent SAV',   reclamation.agentNom || 'Non assigné'],
      ['Note',        reclamation.note ? `${reclamation.note}/5` : 'Non évaluée'],
    ];

    infos.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label} :`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 65, y);
      y += 8;
    });

    y += 10;

    // ── Description ─────────────────────────────────────────
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y - 5, pageWidth - 28, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(10);
    doc.text('DESCRIPTION', 20, y + 1);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(reclamation.description || '', pageWidth - 40);
    doc.text(descLines, 20, y);
    y += descLines.length * 6 + 10;

    // ── Historique ──────────────────────────────────────────
    if (visibleSuivis.length > 0) {
      if (y > 220) { doc.addPage(); y = 20; }

      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 5, pageWidth - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229);
      doc.setFontSize(10);
      doc.text('HISTORIQUE DES ACTIONS', 20, y + 1);
      y += 12;

      visibleSuivis.forEach((s, i) => {
        if (y > 260) { doc.addPage(); y = 20; }

        doc.setFillColor(i % 2 === 0 ? 249 : 255, 249, 255);
        doc.rect(14, y - 4, pageWidth - 28, 16, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(`${s.action}`, 20, y + 2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const dateStr = s.date ? new Date(s.date).toLocaleDateString('fr-FR') : '—';
        doc.text(`${dateStr} — ${s.employeNom || 'Client'}`, pageWidth - 20, y + 2, { align: 'right' });

        doc.setTextColor(50, 50, 50);
        const msgLines = doc.splitTextToSize(s.message, pageWidth - 40);
        doc.text(msgLines, 20, y + 9);
        y += 18 + (msgLines.length - 1) * 5;
      });
    }

    // ── Footer ──────────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Généré le ${new Date().toLocaleDateString('fr-FR')} — Page ${i}/${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`reclamation-${reclamation.id}.pdf`);
  }
}
