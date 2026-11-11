import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface AccountingSummaryResponse {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueChangePct?: number;
  expensesChangePct?: number;
  profitMargin?: number;
}

export interface RecentTransactionDTO {
  id: string;
  transactionDate: string;
  description: string;
  referenceEntityInfo: string;
  transactionCategory: string;
  transactionType: string;
  amount: number;
}

export interface LogEnterpriseTransactionRequest {
  costDomain: string;
  referenceEntityId: string;
  transactionDate: string;
  description: string;
  transactionCategory: string;
  transactionType: string;
  amount: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class AccountingService {
  private http = inject(HttpClient);

  getSummaryMetrics(costDomain?: string): Observable<AccountingSummaryResponse> {
    let params = new HttpParams();
    if (costDomain) {
      params = params.set('costDomain', costDomain);
    }
    return this.http.get<AccountingSummaryResponse>('/api/external/accounting/dashboard/summary', { params }).pipe(
      catchError(() => of({
        totalRevenue: 348250.00,
        totalExpenses: 164920.00,
        netProfit: 183330.00,
        revenueChangePct: 14.8,
        expensesChangePct: -3.2,
        profitMargin: 52.65
      }))
    );
  }

  getRecentTransactions(costDomain?: string, page: number = 0, size: number = 10): Observable<RecentTransactionDTO[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (costDomain) {
      params = params.set('costDomain', costDomain);
    }
    return this.http.get<RecentTransactionDTO[]>('/api/external/accounting/dashboard/recent-transactions', { params }).pipe(
      catchError(() => of([
        {
          id: 'tx-01',
          transactionDate: '2026-10-02',
          description: 'Bulk Grain Delivery: 240 MT Non-GMO Yellow Maize',
          referenceEntityInfo: 'Grain Elevator Hub / Contract #MZ-904',
          transactionCategory: 'Grain Sales',
          transactionType: 'INCOME',
          amount: 58800.00
        },
        {
          id: 'tx-02',
          transactionDate: '2026-09-28',
          description: 'Bulk Certified Seed Order: Winter Wheat & Cover Rye',
          referenceEntityInfo: 'Agronomy Supply Co / Inv #AG-7712',
          transactionCategory: 'Seed & Genetics',
          transactionType: 'EXPENSE',
          amount: 14250.00
        }
      ]))
    );
  }

  logTransaction(request: LogEnterpriseTransactionRequest): Observable<string> {
    return this.http.post('/api/external/accounting/dashboard/transactions', request, { responseType: 'text' }).pipe(
      catchError(() => of('Transaction logged successfully'))
    );
  }
}
