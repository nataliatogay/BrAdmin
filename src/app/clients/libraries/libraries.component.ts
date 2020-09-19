import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/Utils/confirmation-dialog/confirmation-dialog.component';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { ClientParameterInfo } from 'src/app/core/models/client-parameter-info';
import { forkJoin } from 'rxjs';
import { LibraryItemComponent } from '../library-item/library-item.component';
import { StatusCode, ServerResponseGeneric } from 'src/app/core/models/server-response';
import { isUndefined } from 'util';
import { ConfirmationType } from 'src/app/core/models/confirmation-type';
import { LoadingService } from 'src/app/core/services/loading.service';


@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.css']
})
export class LibrariesComponent implements OnInit {

  methods: string[] = ['clientType', 'cuisine', 'dish', 'goodFor', 'specialDiet', 'feature'];
  selectedMethodIndex = 0;
  parameters: ClientParameterInfo[][] = [];

  oldId = '';

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private parameterService: ParameterService,
    public dialog: MatDialog,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {

    this.loadingService.setIsLoading(true);

    forkJoin(
      this.parameterService.getClientTypes(),
      this.parameterService.getCuisines(),
      this.parameterService.getDishes(),
      this.parameterService.getGoodFors(),
      this.parameterService.getSpecialDiets(),
      this.parameterService.getFeatures()
    ).subscribe(
      (result: any) => {
        console.log(result);

        this.parameters.push(result[0].data);
        this.parameters.push(result[1].data);
        this.parameters.push(result[2].data);
        this.parameters.push(result[3].data);
        this.parameters.push(result[4].data);
        this.parameters.push(result[5].data);

        this.parameters.forEach(element => {
          element.sort((item1, item2) => item1.title.localeCompare(item2.title));
        });

        this.loadingService.setIsLoading(false);
      },
      (error) => {
        console.log(error);
        this.loadingService.setIsLoading(false);
      }
    );
  }

  routeChange(id) {
    if (this.oldId.localeCompare('')) {
      document.getElementById(this.oldId).classList.toggle('checkedLine');
    }
    document.getElementById(id).classList.toggle('checkedLine');
    this.oldId = id;
  }

  selectArray(event) {
    this.selectedMethodIndex = event.index;
  }

  deleteParameter(parameter: ClientParameterInfo) {
    if (!isUndefined(parameter) && parameter.editable) {

      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        data:
        {
          type: ConfirmationType.Confirmation,
          message: 'Are you sure you want to delete this item?',
          title: 'Confirmation'
        }
      });


      this.dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {

          this.parameterService.deleteParameter(parameter.id, this.methods[this.selectedMethodIndex]).subscribe(
            (result) => {
              if (result.statusCode === StatusCode.Ok) {
                this.parameters[this.selectedMethodIndex].splice(this.parameters[this.selectedMethodIndex].findIndex(item => item.id === parameter.id), 1);
              } else {
                this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: true,
                  data:
                  {
                    type: ConfirmationType.Error,
                    message: 'An error has occured',
                    title: 'Error'
                  }
                });
              }
            }
          )
        }

        this.dialogRef = null;
      });

    } else {
      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        data:
        {
          type: ConfirmationType.Warning,
          message: 'This feature can\'t be deleted',
          title: 'Warning'
        }
      });
    }
  }

  editParameter(parameter: ClientParameterInfo) {
    const titlePrevious = parameter.title;

    if (!isUndefined(parameter) && parameter.editable) {
      setTimeout(() => {
        const dialogRef = this.dialog.open(LibraryItemComponent, {
          disableClose: true,
          data:
          {
            selectedArrayIndex: this.selectedMethodIndex,
            item: parameter
          }
        }
        );

        dialogRef.afterClosed().subscribe(result => {
          if (result) {

            parameter.title = result;

            this.parameterService.updateParameter(parameter, this.methods[this.selectedMethodIndex]).subscribe(
              (result) => {
                if (result.statusCode !== StatusCode.Ok) {

                  parameter.title = titlePrevious;
                  this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    disableClose: false,
                    data:
                    {
                      type: ConfirmationType.Error,
                      message: 'Error has occured',
                      title: 'Error'
                    }
                  });
                }
              }
            );
          }
        });
      });

    } else {
      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        data:
        {
          type: ConfirmationType.Warning,
          message: 'This feature can\'t be edited',
          title: 'Warning'
        }
      });
    }
  }


  addParameter() {
    setTimeout(() => {
      const dialogRef = this.dialog.open(LibraryItemComponent, {
        disableClose: true,
        data:
        {
          selectedArrayIndex: this.selectedMethodIndex,
          item: null
        }
      }
      );

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {

          this.parameterService.addParameter(dialogResult, this.methods[this.selectedMethodIndex]).subscribe(
            (result: ServerResponseGeneric<ClientParameterInfo>) => {
              if (result.statusCode === StatusCode.Ok) {
                this.parameters[this.selectedMethodIndex].push(result.data);
                this.parameters[this.selectedMethodIndex].sort((item1, item2) => item1.title.localeCompare(item2.title));
              } else {

                this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: true,
                  data:
                  {
                    type: ConfirmationType.Error,
                    message: 'Error has occured',
                    title: 'Error'
                  }
                });
              }
            }
          );
        }
      });
    });
  }

}
