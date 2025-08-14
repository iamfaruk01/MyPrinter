// Mock Printer Service for testing purposes

export interface Printer {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  connectionType: 'wifi' | 'bluetooth' | 'usb';
  paperLevel: number; // 0-100
  inkLevel: number; // 0-100
  location?: string;
}

export interface PrintJob {
  id: string;
  fileName: string;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  progress: number; // 0-100
  pages: number;
  createdAt: Date;
  completedAt?: Date;
}

class MockPrinterService {
  private printers: Printer[] = [
    {
      id: 'printer-1',
      name: 'HP LaserJet Pro M404dn',
      model: 'HP LaserJet Pro',
      status: 'online',
      connectionType: 'wifi',
      paperLevel: 85,
      inkLevel: 60,
      location: 'Office Room'
    },
    {
      id: 'printer-2',
      name: 'Canon PIXMA TS3350',
      model: 'Canon PIXMA',
      status: 'offline',
      connectionType: 'wifi',
      paperLevel: 20,
      inkLevel: 30,
      location: 'Home Office'
    },
    {
      id: 'printer-3',
      name: 'Brother HL-L2350DW',
      model: 'Brother Laser',
      status: 'online',
      connectionType: 'bluetooth',
      paperLevel: 95,
      inkLevel: 80,
      location: 'Main Office'
    }
  ];

  private printJobs: PrintJob[] = [];
  private connectedPrinter: Printer | null = null;

  // Simulate network delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Discover available printers
  async discoverPrinters(): Promise<Printer[]> {
    console.log('🔍 Scanning for printers...');
    await this.delay(2000); // Simulate scanning time
    
    // Randomly change some printer statuses for realism
    this.printers.forEach(printer => {
      if (Math.random() < 0.3) {
        printer.status = Math.random() < 0.5 ? 'online' : 'offline';
      }
    });

    console.log(`📡 Found ${this.printers.length} printers`);
    return [...this.printers];
  }

  // Connect to a specific printer
  async connectToPrinter(printerId: string): Promise<boolean> {
    console.log(`🔌 Connecting to printer ${printerId}...`);
    await this.delay(1500);

    const printer = this.printers.find(p => p.id === printerId);
    if (!printer) {
      console.log('❌ Printer not found');
      return false;
    }

    if (printer.status === 'offline') {
      console.log('❌ Printer is offline');
      return false;
    }

    this.connectedPrinter = printer;
    printer.status = 'online';
    console.log(`✅ Connected to ${printer.name}`);
    return true;
  }

  // Disconnect from current printer
  async disconnect(): Promise<void> {
    if (this.connectedPrinter) {
      console.log(`🔌 Disconnecting from ${this.connectedPrinter.name}`);
      await this.delay(500);
      this.connectedPrinter = null;
      console.log('✅ Disconnected');
    }
  }

  // Get current connected printer
  getConnectedPrinter(): Printer | null {
    return this.connectedPrinter;
  }

  // Print a document
  async printDocument(fileName: string, pages: number = 1): Promise<PrintJob> {
    if (!this.connectedPrinter) {
      throw new Error('No printer connected');
    }

    const printJob: PrintJob = {
      id: `job-${Date.now()}`,
      fileName,
      status: 'pending',
      progress: 0,
      pages,
      createdAt: new Date()
    };

    this.printJobs.push(printJob);
    console.log(`🖨️ Starting print job: ${fileName}`);

    // Simulate printing process
    this.simulatePrinting(printJob);

    return printJob;
  }

  // Simulate printing progress
  private async simulatePrinting(job: PrintJob): Promise<void> {
    if (!this.connectedPrinter) return;

    job.status = 'printing';
    this.connectedPrinter.status = 'busy';

    // Simulate printing progress
    for (let progress = 0; progress <= 100; progress += 10) {
      job.progress = progress;
      console.log(`🖨️ Printing ${job.fileName}: ${progress}%`);
      await this.delay(500);

      // Simulate random failures (5% chance)
      if (progress > 0 && Math.random() < 0.05) {
        job.status = 'failed';
        this.connectedPrinter.status = 'error';
        console.log(`❌ Print job failed: ${job.fileName}`);
        return;
      }
    }

    // Complete the job
    job.status = 'completed';
    job.progress = 100;
    job.completedAt = new Date();
    this.connectedPrinter.status = 'online';

    // Update printer levels
    this.connectedPrinter.paperLevel = Math.max(0, this.connectedPrinter.paperLevel - (job.pages * 2));
    this.connectedPrinter.inkLevel = Math.max(0, this.connectedPrinter.inkLevel - (job.pages * 3));

    console.log(`✅ Print job completed: ${job.fileName}`);
  }

  // Get all print jobs
  getPrintJobs(): PrintJob[] {
    return [...this.printJobs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get printer status
  async getPrinterStatus(printerId: string): Promise<Printer | null> {
    await this.delay(200);
    const printer = this.printers.find(p => p.id === printerId);
    
    if (printer) {
      // Simulate random status changes
      if (Math.random() < 0.1) {
        printer.status = printer.status === 'online' ? 'offline' : 'online';
      }
    }
    
    return printer || null;
  }

  // Test printer connection
  async testConnection(): Promise<boolean> {
    if (!this.connectedPrinter) return false;
    
    console.log('🧪 Testing printer connection...');
    await this.delay(1000);
    
    // 90% success rate
    const success = Math.random() < 0.9;
    console.log(success ? '✅ Connection test passed' : '❌ Connection test failed');
    
    if (!success && this.connectedPrinter) {
      this.connectedPrinter.status = 'error';
    }
    
    return success;
  }

  // Reset printer (clear errors)
  async resetPrinter(): Promise<boolean> {
    if (!this.connectedPrinter) return false;
    
    console.log('🔄 Resetting printer...');
    await this.delay(2000);
    
    this.connectedPrinter.status = 'online';
    console.log('✅ Printer reset successfully');
    
    return true;
  }

  // Get printer capabilities
  getPrinterCapabilities(): {
    maxPaperSize: string;
    colorSupport: boolean;
    duplexSupport: boolean;
    maxResolution: string;
  } {
    if (!this.connectedPrinter) {
      throw new Error('No printer connected');
    }

    // Mock capabilities based on printer model
    const capabilities = {
      'HP LaserJet Pro': {
        maxPaperSize: 'A4',
        colorSupport: false,
        duplexSupport: true,
        maxResolution: '1200x1200 DPI'
      },
      'Canon PIXMA': {
        maxPaperSize: 'A4',
        colorSupport: true,
        duplexSupport: false,
        maxResolution: '4800x1200 DPI'
      },
      'Brother Laser': {
        maxPaperSize: 'A4',
        colorSupport: false,
        duplexSupport: true,
        maxResolution: '2400x600 DPI'
      }
    };

    return capabilities[this.connectedPrinter.model as keyof typeof capabilities] || capabilities['HP LaserJet Pro'];
  }
}

// Export singleton instance
export const mockPrinterService = new MockPrinterService();

// Export types
export default MockPrinterService;