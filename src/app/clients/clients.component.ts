import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { ClientComponent } from './client/client.component';
import { ClientService } from '../core/services/client.service';
import { NewClientComponent } from './new-client/new-client.component';
import { ServerResponse, StatusCode, ServerResponseGeneric } from '../core/models/server-response';
import { ClientInfoShort } from '../core/models/client-info-short';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: ClientInfoShort[] = [];

  displayedColumns: string[] = ['position', 'title', 'email', 'number', 'registrationDate', 'blocked', 'deleted'];

  clientsDataSource = new MatTableDataSource;

  dialogRef: MatDialogRef<ClientComponent>;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.clientsDataSource.paginator = paginator;
  }

  view = true;

  oldId = 'gridId';

  constructor(
    public dialog: MatDialog,
    public clientService: ClientService
  ) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(
      (result: ServerResponseGeneric<ClientInfoShort[]>) => {
        if (result.statusCode === StatusCode.Ok) {
          this.clients = result.data;
          this.clientsDataSource.data = this.clients;
        } else {

          alert(result.statusCode);
        }
      }
    )
  }

  viewChange(id, vBool) {
    document.getElementById(this.oldId).classList.toggle('choosenView');

    document.getElementById(id).classList.toggle('choosenView');

    this.oldId = id;
    this.view = vBool;
  }



  addNewClient() {
    setTimeout(() => {
      const dialogRef = this.dialog.open(NewClientComponent, {
        disableClose: true
      }
      );

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.data != null) {
          console.log(dialogResult.data);
          this.clientService.addClient(dialogResult.data).subscribe(
            (result: ServerResponse) => {
              if (result.statusCode === StatusCode.Ok) {
                alert('Success');
                window.location.reload();
              } else {
                alert(result.statusCode);
              }
            }
          )
        }
      });
    });
  }
}
